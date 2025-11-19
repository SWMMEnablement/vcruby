import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Sphere, Text, Grid } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw, Upload, Download } from 'lucide-react';
import * as THREE from 'three';

interface Node3D {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number; // Invert elevation
  type: 'station' | 'manhole' | 'valve';
  head?: number;
}

interface Pipe3D {
  id: string;
  from: string;
  to: string;
  diameter: number;
  flow: number;
  usInvert: number;
  dsInvert: number;
}

// Individual Node Component
function NetworkNode({ node, isActive }: { node: Node3D; isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current && isActive) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  const getColor = () => {
    if (node.type === 'station') return '#ef4444';
    if (node.head !== undefined) {
      // Color based on head pressure
      const normalized = Math.max(0, Math.min(1, node.head / 8));
      return new THREE.Color().setHSL(0.6 - normalized * 0.6, 0.8, 0.5);
    }
    return '#3b82f6';
  };

  const size = node.type === 'station' ? 0.8 : 0.4;

  return (
    <group position={[node.x, node.z, node.y]}>
      <Sphere ref={meshRef} args={[size, 16, 16]}>
        <meshStandardMaterial color={getColor()} emissive={isActive ? '#ffffff' : '#000000'} emissiveIntensity={isActive ? 0.5 : 0} />
      </Sphere>
      <Text
        position={[0, size + 0.5, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {node.label}
      </Text>
      {node.head !== undefined && (
        <Text
          position={[0, size + 1, 0]}
          fontSize={0.3}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
        >
          {node.head.toFixed(2)}m
        </Text>
      )}
    </group>
  );
}

// Individual Pipe Component
function NetworkPipe({ pipe, nodes, isActive }: { pipe: Pipe3D; nodes: Node3D[]; isActive: boolean }) {
  const fromNode = nodes.find(n => n.id === pipe.from);
  const toNode = nodes.find(n => n.id === pipe.to);

  if (!fromNode || !toNode) return null;

  const points = [
    new THREE.Vector3(fromNode.x, fromNode.z, fromNode.y),
    new THREE.Vector3(toNode.x, toNode.z, toNode.y),
  ];

  // Color based on flow velocity
  const velocity = pipe.flow / (Math.PI * Math.pow(pipe.diameter / 2000, 2));
  const normalized = Math.min(1, velocity / 2);
  const color = new THREE.Color().setHSL(0.6 - normalized * 0.3, 0.8, 0.5);

  return (
    <group>
      <Line
        points={points}
        color={color}
        lineWidth={Math.max(1, pipe.diameter / 50)}
        opacity={isActive ? 1 : 0.6}
        transparent
      />
      {/* Flow direction arrow */}
      {isActive && (
        <mesh position={[(fromNode.x + toNode.x) / 2, (fromNode.z + toNode.z) / 2, (fromNode.y + toNode.y) / 2]}>
          <coneGeometry args={[0.2, 0.5, 8]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
        </mesh>
      )}
    </group>
  );
}

// Elevation Profile Grid
function ElevationGrid({ nodes }: { nodes: Node3D[] }) {
  const minZ = Math.min(...nodes.map(n => n.z));
  const maxZ = Math.max(...nodes.map(n => n.z));
  const range = maxZ - minZ;

  return (
    <group>
      <Grid
        args={[100, 100]}
        position={[0, minZ - 1, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        cellColor="#6b7280"
        sectionColor="#9ca3af"
        fadeDistance={80}
        fadeStrength={1}
      />
      {/* Elevation reference planes */}
      {[0, 0.25, 0.5, 0.75, 1].map((factor, i) => {
        const elevation = minZ + range * factor;
        return (
          <group key={i}>
            <mesh position={[0, elevation, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <planeGeometry args={[100, 100]} />
              <meshBasicMaterial color="#1f2937" transparent opacity={0.1} side={THREE.DoubleSide} />
            </mesh>
            <Text
              position={[-50, elevation, 0]}
              fontSize={1}
              color="#9ca3af"
              anchorX="left"
              anchorY="middle"
            >
              {elevation.toFixed(1)}m
            </Text>
          </group>
        );
      })}
    </group>
  );
}

// Animated flow particles
function FlowParticles({ pipe, nodes }: { pipe: Pipe3D; nodes: Node3D[] }) {
  const particlesRef = useRef<THREE.Group>(null);
  const [particles] = useState(() => {
    return Array.from({ length: 5 }, (_, i) => ({ offset: i / 5 }));
  });

  const fromNode = nodes.find(n => n.id === pipe.from);
  const toNode = nodes.find(n => n.id === pipe.to);

  useFrame((state) => {
    if (!particlesRef.current || !fromNode || !toNode) return;
    
    const speed = 0.005;
    particles.forEach((particle, i) => {
      particle.offset = (particle.offset + speed) % 1;
      const child = particlesRef.current!.children[i];
      if (child) {
        child.position.x = fromNode.x + (toNode.x - fromNode.x) * particle.offset;
        child.position.y = fromNode.z + (toNode.z - fromNode.z) * particle.offset;
        child.position.z = fromNode.y + (toNode.y - fromNode.y) * particle.offset;
      }
    });
  });

  if (!fromNode || !toNode) return null;

  return (
    <group ref={particlesRef}>
      {particles.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1} />
        </mesh>
      ))}
    </group>
  );
}

// Main 3D Scene
function Scene({ nodes, pipes, activeNodeId, showFlow }: { 
  nodes: Node3D[]; 
  pipes: Pipe3D[]; 
  activeNodeId: string | null;
  showFlow: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
      <directionalLight position={[-10, 10, -10]} intensity={0.5} />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#3b82f6" />
      
      <ElevationGrid nodes={nodes} />
      
      {pipes.map((pipe) => (
        <NetworkPipe 
          key={pipe.id} 
          pipe={pipe} 
          nodes={nodes} 
          isActive={showFlow && (pipe.from === activeNodeId || pipe.to === activeNodeId)}
        />
      ))}
      
      {showFlow && pipes.map((pipe) => (
        pipe.from === activeNodeId || pipe.to === activeNodeId ? (
          <FlowParticles key={`flow-${pipe.id}`} pipe={pipe} nodes={nodes} />
        ) : null
      ))}
      
      {nodes.map((node) => (
        <NetworkNode 
          key={node.id} 
          node={node} 
          isActive={node.id === activeNodeId}
        />
      ))}
      
      <OrbitControls 
        enableDamping 
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={100}
      />
    </>
  );
}

export function Network3DVisualizer() {
  const [nodes, setNodes] = useState<Node3D[]>([
    { id: 'VS1', label: 'Vacuum Station', x: 0, y: 0, z: 0, type: 'station', head: 0 },
    { id: 'MH1', label: 'MH-1', x: 10, y: 5, z: -2, type: 'manhole', head: 3.2 },
    { id: 'MH2', label: 'MH-2', x: 20, y: 10, z: -3.5, type: 'manhole', head: 4.5 },
    { id: 'MH3', label: 'MH-3', x: 30, y: 5, z: -2.8, type: 'manhole', head: 5.8 },
    { id: 'VV1', label: 'Valve', x: 15, y: -5, z: -2.2, type: 'valve', head: 3.8 },
  ]);

  const [pipes, setPipes] = useState<Pipe3D[]>([
    { id: 'P1', from: 'VS1', to: 'MH1', diameter: 150, flow: 15, usInvert: 0, dsInvert: -2 },
    { id: 'P2', from: 'MH1', to: 'MH2', diameter: 100, flow: 12, usInvert: -2, dsInvert: -3.5 },
    { id: 'P3', from: 'MH2', to: 'MH3', diameter: 100, flow: 10, usInvert: -3.5, dsInvert: -2.8 },
    { id: 'P4', from: 'VS1', to: 'VV1', diameter: 100, flow: 8, usInvert: 0, dsInvert: -2.2 },
  ]);

  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [showFlow, setShowFlow] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const startSimulation = () => {
    if (nodes.length === 0) return;
    setIsSimulating(true);
    setShowFlow(true);
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex >= nodes.length) {
        clearInterval(interval);
        setIsSimulating(false);
        setActiveNodeId(null);
        return;
      }
      setActiveNodeId(nodes[currentIndex].id);
      currentIndex++;
    }, 1000);
  };

  const resetView = () => {
    setActiveNodeId(null);
    setShowFlow(false);
    setIsSimulating(false);
  };

  const exportNetwork = () => {
    const data = { nodes, pipes };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'network_3d.json';
    a.click();
  };

  const importNetwork = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setNodes(data.nodes || []);
        setPipes(data.pipes || []);
      } catch (error) {
        console.error('Failed to parse network file:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">3D Network Visualization</h3>
            <p className="text-sm text-muted-foreground">
              Interactive 3D view of the vacuum sewer network with real-time flow simulation and elevation profiles.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={isSimulating ? resetView : startSimulation}
              disabled={nodes.length === 0}
              variant={isSimulating ? "destructive" : "default"}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Simulate Flow
                </>
              )}
            </Button>

            <Button onClick={resetView} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset View
            </Button>

            <Button onClick={exportNetwork} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            <Label htmlFor="import-3d" className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </span>
              </Button>
              <Input
                id="import-3d"
                type="file"
                accept=".json"
                onChange={importNetwork}
                className="hidden"
              />
            </Label>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Nodes:</span> {nodes.length}
            </div>
            <div>
              <span className="font-medium">Pipes:</span> {pipes.length}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-background border-border">
        <div className="h-[600px] rounded-lg overflow-hidden bg-slate-950">
          <Canvas camera={{ position: [40, 30, 40], fov: 60 }}>
            <Scene 
              nodes={nodes} 
              pipes={pipes} 
              activeNodeId={activeNodeId}
              showFlow={showFlow}
            />
          </Canvas>
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="font-semibold mb-2">Legend</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span>Vacuum Station</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500" />
            <span>Manhole</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500" />
            <span>Flow Particles</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-red-500" />
            <span>Head Pressure (Low → High)</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
