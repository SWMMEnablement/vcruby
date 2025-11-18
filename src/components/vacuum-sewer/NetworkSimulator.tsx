import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Plus, Trash2 } from "lucide-react";

interface Node {
  id: string;
  x: number;
  y: number;
  invert: number;
  head: number;
  isStation: boolean;
  label: string;
}

interface Pipe {
  id: string;
  fromId: string;
  toId: string;
  length: number;
  diameter: number;
  flow: number;
  roughness: number;
}

const NetworkSimulator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([
    { id: "VS", x: 100, y: 300, invert: 0, head: 0, isStation: true, label: "Vacuum Station" },
    { id: "N1", x: 250, y: 250, invert: 1.0, head: 0, isStation: false, label: "Node 1" },
    { id: "N2", x: 400, y: 280, invert: 0.5, head: 0, isStation: false, label: "Node 2" },
    { id: "N3", x: 250, y: 350, invert: 1.5, head: 0, isStation: false, label: "Node 3" },
    { id: "N4", x: 550, y: 230, invert: 2.0, head: 0, isStation: false, label: "Node 4" },
  ]);
  
  const [pipes, setPipes] = useState<Pipe[]>([
    { id: "P1", fromId: "N1", toId: "VS", length: 100, diameter: 150, flow: 2.5, roughness: 120 },
    { id: "P2", fromId: "N2", toId: "VS", length: 120, diameter: 150, flow: 1.8, roughness: 120 },
    { id: "P3", fromId: "N3", toId: "VS", length: 80, diameter: 150, flow: 2.0, roughness: 120 },
    { id: "P4", fromId: "N4", toId: "N2", length: 90, diameter: 150, flow: 1.8, roughness: 120 },
  ]);

  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [simulationQueue, setSimulationQueue] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Calculate friction head using Hazen-Williams
  const calcFrictionHead = (length: number, diameter: number, roughness: number, flow: number) => {
    if (flow <= 0) return 0;
    const d_m = diameter / 1000.0;
    const q_cms = flow / 1000.0;
    const hf = 10.67 * length * Math.pow(q_cms / roughness, 1.852) * Math.pow(d_m, -4.87);
    return hf;
  };

  // Calculate static lift (EPA Sawtooth: only uphill counts)
  const calcStaticLift = (usInvert: number, dsInvert: number) => {
    const diff = dsInvert - usInvert;
    return diff > 0 ? diff : 0;
  };

  // Run simulation
  const runSimulation = () => {
    // Reset all nodes
    const resetNodes = nodes.map(n => ({ ...n, head: n.isStation ? 0 : 0 }));
    setNodes(resetNodes);
    
    // Build connectivity map
    const upstreamMap: { [key: string]: Pipe[] } = {};
    pipes.forEach(pipe => {
      if (!upstreamMap[pipe.toId]) upstreamMap[pipe.toId] = [];
      upstreamMap[pipe.toId].push(pipe);
    });

    // Find vacuum station
    const station = nodes.find(n => n.isStation);
    if (!station) return;

    // BFS from station
    const queue: string[] = [station.id];
    const processed = new Set<string>();
    const animationQueue: string[] = [];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (processed.has(currentId)) continue;
      processed.add(currentId);
      animationQueue.push(currentId);

      const incomingPipes = upstreamMap[currentId] || [];
      
      incomingPipes.forEach(pipe => {
        if (!processed.has(pipe.fromId)) {
          queue.push(pipe.fromId);
        }
      });
    }

    setSimulationQueue(animationQueue);
    setCurrentStep(0);
    setIsSimulating(true);
  };

  // Animation step
  useEffect(() => {
    if (!isSimulating || currentStep >= simulationQueue.length) {
      if (currentStep >= simulationQueue.length) setIsSimulating(false);
      return;
    }

    const timer = setTimeout(() => {
      const currentNodeId = simulationQueue[currentStep];
      
      // Calculate head for upstream nodes
      const updatedNodes = [...nodes];
      const currentNode = updatedNodes.find(n => n.id === currentNodeId);
      if (!currentNode) return;

      // Find pipes feeding into this node
      const incomingPipes = pipes.filter(p => p.toId === currentNodeId);
      
      incomingPipes.forEach(pipe => {
        const upstreamNode = updatedNodes.find(n => n.id === pipe.fromId);
        if (!upstreamNode) return;

        const friction = calcFrictionHead(pipe.length, pipe.diameter, pipe.roughness, pipe.flow);
        const staticLift = calcStaticLift(upstreamNode.invert, currentNode.invert);
        
        upstreamNode.head = currentNode.head + friction + staticLift;
      });

      setNodes(updatedNodes);
      setCurrentStep(prev => prev + 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [isSimulating, currentStep, simulationQueue]);

  // Draw network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pipes
    pipes.forEach(pipe => {
      const fromNode = nodes.find(n => n.id === pipe.fromId);
      const toNode = nodes.find(n => n.id === pipe.toId);
      if (!fromNode || !toNode) return;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.strokeStyle = "hsl(var(--muted-foreground))";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw arrow
      const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
      const arrowSize = 10;
      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;
      
      ctx.beginPath();
      ctx.moveTo(midX, midY);
      ctx.lineTo(
        midX - arrowSize * Math.cos(angle - Math.PI / 6),
        midY - arrowSize * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(midX, midY);
      ctx.lineTo(
        midX - arrowSize * Math.cos(angle + Math.PI / 6),
        midY - arrowSize * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(node => {
      const isActive = isSimulating && simulationQueue[currentStep] === node.id;
      const isProcessed = isSimulating && simulationQueue.indexOf(node.id) < currentStep;
      
      // Node color based on head
      let color = "hsl(var(--secondary))";
      if (node.isStation) {
        color = "hsl(var(--primary))";
      } else if (isProcessed || !isSimulating) {
        if (node.head > 4.0) color = "hsl(0, 70%, 50%)"; // Red
        else if (node.head > 3.5) color = "hsl(30, 80%, 50%)"; // Orange
        else if (node.head > 3.0) color = "hsl(45, 85%, 55%)"; // Yellow
        else if (node.head > 0) color = "hsl(140, 60%, 45%)"; // Green
      }

      // Draw node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.isStation ? 20 : 15, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      
      // Highlight active node
      if (isActive) {
        ctx.strokeStyle = "hsl(var(--primary))";
        ctx.lineWidth = 4;
        ctx.stroke();
      } else {
        ctx.strokeStyle = "hsl(var(--border))";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw label
      ctx.fillStyle = "hsl(var(--foreground))";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(node.label, node.x, node.y - 25);

      // Draw head value
      if ((isProcessed || !isSimulating) && node.head > 0) {
        ctx.fillStyle = "hsl(var(--foreground))";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText(`${node.head.toFixed(2)}m`, node.x, node.y + 35);
      }
    });
  }, [nodes, pipes, isSimulating, currentStep, simulationQueue]);

  const resetSimulation = () => {
    setIsSimulating(false);
    setCurrentStep(0);
    setSimulationQueue([]);
    setNodes(nodes.map(n => ({ ...n, head: 0 })));
  };

  const addNode = () => {
    const newId = `N${nodes.length}`;
    setNodes([...nodes, {
      id: newId,
      x: 300 + Math.random() * 200,
      y: 200 + Math.random() * 200,
      invert: 1.0,
      head: 0,
      isStation: false,
      label: `Node ${nodes.length}`
    }]);
  };

  const updateNode = (id: string, field: keyof Node, value: any) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex gap-2 mb-4">
          <Button 
            onClick={runSimulation} 
            disabled={isSimulating}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Run Simulation
          </Button>
          <Button 
            onClick={resetSimulation}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button 
            onClick={addNode}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Node
          </Button>
        </div>

        <canvas 
          ref={canvasRef} 
          width={700} 
          height={500}
          className="border border-border rounded-lg w-full bg-background"
          onClick={(e) => {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Find clicked node
            const clicked = nodes.find(n => {
              const dist = Math.sqrt(Math.pow(n.x - x, 2) + Math.pow(n.y - y, 2));
              return dist < 20;
            });
            
            setSelectedNode(clicked ? clicked.id : null);
          }}
        />

        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "hsl(140, 60%, 45%)" }} />
            <span className="text-sm">0-3.0m (Good)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "hsl(45, 85%, 55%)" }} />
            <span className="text-sm">3.0-3.5m (Caution)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "hsl(30, 80%, 50%)" }} />
            <span className="text-sm">3.5-4.0m (Warning)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "hsl(0, 70%, 50%)" }} />
            <span className="text-sm">&gt;4.0m (Critical)</span>
          </div>
        </div>
      </Card>

      {selectedNodeData && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            Edit Node: <Badge>{selectedNodeData.label}</Badge>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Label</Label>
              <Input 
                value={selectedNodeData.label}
                onChange={(e) => updateNode(selectedNodeData.id, "label", e.target.value)}
              />
            </div>
            <div>
              <Label>Invert Elevation (m)</Label>
              <Input 
                type="number"
                step="0.1"
                value={selectedNodeData.invert}
                onChange={(e) => updateNode(selectedNodeData.id, "invert", parseFloat(e.target.value))}
              />
            </div>
            <div className="col-span-2">
              <Label>Calculated Vacuum Head</Label>
              <div className="p-3 bg-secondary rounded-lg">
                <span className="text-2xl font-bold">
                  {selectedNodeData.head.toFixed(3)} m
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {selectedNode && pipes.some(p => p.fromId === selectedNode || p.toId === selectedNode) && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Connected Pipes</h3>
          <div className="space-y-2">
            {pipes
              .filter(p => p.fromId === selectedNode || p.toId === selectedNode)
              .map(pipe => (
                <div key={pipe.id} className="p-3 bg-secondary rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <Badge>{pipe.id}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {pipe.fromId} → {pipe.toId}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <Label className="text-xs">Length (m)</Label>
                      <Input 
                        type="number"
                        value={pipe.length}
                        onChange={(e) => {
                          setPipes(pipes.map(p => 
                            p.id === pipe.id ? { ...p, length: parseFloat(e.target.value) } : p
                          ));
                        }}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Ø (mm)</Label>
                      <Input 
                        type="number"
                        value={pipe.diameter}
                        onChange={(e) => {
                          setPipes(pipes.map(p => 
                            p.id === pipe.id ? { ...p, diameter: parseFloat(e.target.value) } : p
                          ));
                        }}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Flow (L/s)</Label>
                      <Input 
                        type="number"
                        step="0.1"
                        value={pipe.flow}
                        onChange={(e) => {
                          setPipes(pipes.map(p => 
                            p.id === pipe.id ? { ...p, flow: parseFloat(e.target.value) } : p
                          ));
                        }}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">C-value</Label>
                      <Input 
                        type="number"
                        value={pipe.roughness}
                        onChange={(e) => {
                          setPipes(pipes.map(p => 
                            p.id === pipe.id ? { ...p, roughness: parseFloat(e.target.value) } : p
                          ));
                        }}
                        className="h-8"
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default NetworkSimulator;
