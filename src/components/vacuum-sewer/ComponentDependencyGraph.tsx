import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Network, 
  GitBranch, 
  ArrowRight, 
  Circle,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2
} from "lucide-react";
import { componentDocs, type ComponentDoc } from "@/lib/componentDocs";

interface DependencyNode {
  id: string;
  name: string;
  category: string;
  dependencies: string[];
  dependents: string[];
  depth: number;
}

interface DependencyLink {
  source: string;
  target: string;
}

const ComponentDependencyGraph = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"tree" | "matrix" | "list">("tree");
  const [zoom, setZoom] = useState(1);

  // Build dependency graph
  const { nodes, links, matrix } = useMemo(() => {
    const nodeMap = new Map<string, DependencyNode>();
    const linkList: DependencyLink[] = [];
    
    // Initialize nodes
    componentDocs.forEach(doc => {
      nodeMap.set(doc.name, {
        id: doc.name,
        name: doc.name,
        category: doc.category,
        dependencies: [],
        dependents: [],
        depth: 0
      });
    });

    // Build dependencies based on actual imports
    const dependencyMap: Record<string, string[]> = {
      "ICMIntegration": ["RTCCodeGenerator", "RTCLogicSimulator", "RubyScriptViewer", "SawtoothVisualizer", "ModelDiagnostics", "NetworkValidator", "CostEstimator", "DesignCalculatorTool", "FrictionComparisonCalculator", "Network3DVisualizer"],
      "RTCCodeGenerator": [],
      "RTCLogicSimulator": [],
      "RubyScriptViewer": [],
      "SawtoothVisualizer": [],
      "ModelDiagnostics": [],
      "NetworkValidator": [],
      "CostEstimator": [],
      "DesignCalculatorTool": ["DesignCalculator"],
      "DesignCalculator": [],
      "FrictionComparisonCalculator": [],
      "Network3DVisualizer": [],
      "SystemOverview": ["InteractiveDiagrams", "TechnicalDiagrams", "ComponentsGuide"],
      "InteractiveDiagrams": [],
      "TechnicalDiagrams": [],
      "ComponentsGuide": [],
      "SystemComparison": [],
      "ICMTutorial": [],
      "SampleModels": [],
      "VideoTutorial": [],
      "DocumentationBrowser": [],
      "RubyScriptComparison": []
    };

    // Create links and update nodes
    Object.entries(dependencyMap).forEach(([source, targets]) => {
      const sourceNode = nodeMap.get(source);
      if (sourceNode) {
        sourceNode.dependencies = targets;
        targets.forEach(target => {
          linkList.push({ source, target });
          const targetNode = nodeMap.get(target);
          if (targetNode) {
            targetNode.dependents.push(source);
          }
        });
      }
    });

    // Calculate depths
    const calculateDepth = (name: string, visited: Set<string> = new Set()): number => {
      if (visited.has(name)) return 0;
      visited.add(name);
      const node = nodeMap.get(name);
      if (!node || node.dependencies.length === 0) return 0;
      return 1 + Math.max(...node.dependencies.map(d => calculateDepth(d, visited)));
    };

    nodeMap.forEach((node, name) => {
      node.depth = calculateDepth(name);
    });

    // Build adjacency matrix
    const componentNames = Array.from(nodeMap.keys());
    const matrixData: boolean[][] = componentNames.map(source => 
      componentNames.map(target => 
        dependencyMap[source]?.includes(target) || false
      )
    );

    return {
      nodes: Array.from(nodeMap.values()),
      links: linkList,
      matrix: { names: componentNames, data: matrixData }
    };
  }, []);

  const filteredNodes = selectedComponent === "all" 
    ? nodes 
    : nodes.filter(n => 
        n.name === selectedComponent || 
        n.dependencies.includes(selectedComponent) ||
        n.dependents.includes(selectedComponent)
      );

  const filteredLinks = selectedComponent === "all"
    ? links
    : links.filter(l => 
        l.source === selectedComponent || 
        l.target === selectedComponent
      );

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Documentation": "bg-blue-500",
      "Tools": "bg-green-500",
      "Integration": "bg-purple-500",
      "Code Generation": "bg-orange-500",
      "Testing": "bg-yellow-500",
      "Analysis": "bg-pink-500",
      "Validation": "bg-teal-500",
      "Visualization": "bg-indigo-500"
    };
    return colors[category] || "bg-gray-500";
  };

  const getNodePosition = (node: DependencyNode, index: number, total: number) => {
    const levelNodes = filteredNodes.filter(n => n.depth === node.depth);
    const levelIndex = levelNodes.indexOf(node);
    const levelTotal = levelNodes.length;
    
    const x = 100 + node.depth * 200;
    const y = 50 + (levelIndex + 1) * (400 / (levelTotal + 1));
    
    return { x: x * zoom, y: y * zoom };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Component Dependency Graph</CardTitle>
                <CardDescription>
                  Interactive visualization of component relationships and usage patterns
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setZoom(z => Math.min(2, z + 0.1))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setZoom(1)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <Select value={selectedComponent} onValueChange={setSelectedComponent}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by component" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Components</SelectItem>
                  {nodes.map(node => (
                    <SelectItem key={node.id} value={node.name}>
                      {node.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tree">Tree View</TabsTrigger>
              <TabsTrigger value="matrix">Matrix View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <TabsContent value="tree" className="mt-4">
              <div className="border rounded-lg bg-secondary/20 overflow-auto">
                <svg 
                  width={Math.max(800, (Math.max(...nodes.map(n => n.depth)) + 2) * 200 * zoom)}
                  height={Math.max(500, filteredNodes.length * 40 * zoom)}
                  className="min-w-full"
                >
                  {/* Draw links */}
                  {filteredLinks.map((link, i) => {
                    const sourceNode = filteredNodes.find(n => n.name === link.source);
                    const targetNode = filteredNodes.find(n => n.name === link.target);
                    if (!sourceNode || !targetNode) return null;
                    
                    const sourcePos = getNodePosition(sourceNode, 0, 0);
                    const targetPos = getNodePosition(targetNode, 0, 0);
                    
                    return (
                      <g key={i}>
                        <line
                          x1={sourcePos.x + 80 * zoom}
                          y1={sourcePos.y}
                          x2={targetPos.x - 10 * zoom}
                          y2={targetPos.y}
                          stroke="hsl(var(--muted-foreground))"
                          strokeWidth={1.5}
                          strokeOpacity={0.4}
                          markerEnd="url(#arrowhead)"
                        />
                      </g>
                    );
                  })}
                  
                  {/* Arrow marker definition */}
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 10 3.5, 0 7"
                        fill="hsl(var(--muted-foreground))"
                        fillOpacity={0.6}
                      />
                    </marker>
                  </defs>

                  {/* Draw nodes */}
                  {filteredNodes.map((node, i) => {
                    const pos = getNodePosition(node, i, filteredNodes.length);
                    const isSelected = node.name === selectedComponent;
                    
                    return (
                      <g 
                        key={node.id}
                        transform={`translate(${pos.x - 80 * zoom}, ${pos.y - 15 * zoom})`}
                        className="cursor-pointer"
                        onClick={() => setSelectedComponent(node.name === selectedComponent ? "all" : node.name)}
                      >
                        <rect
                          width={160 * zoom}
                          height={30 * zoom}
                          rx={6 * zoom}
                          fill={isSelected ? "hsl(var(--primary))" : "hsl(var(--card))"}
                          stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--border))"}
                          strokeWidth={isSelected ? 2 : 1}
                        />
                        <text
                          x={80 * zoom}
                          y={18 * zoom}
                          textAnchor="middle"
                          fill={isSelected ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"}
                          fontSize={11 * zoom}
                          fontWeight={isSelected ? "bold" : "normal"}
                        >
                          {node.name.length > 18 ? node.name.slice(0, 16) + "..." : node.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </TabsContent>

            <TabsContent value="matrix" className="mt-4">
              <div className="overflow-auto">
                <table className="text-xs border-collapse">
                  <thead>
                    <tr>
                      <th className="p-1 border bg-secondary font-medium text-left min-w-[120px]">
                        From ↓ / To →
                      </th>
                      {matrix.names.map(name => (
                        <th 
                          key={name} 
                          className="p-1 border bg-secondary font-medium text-center"
                          style={{ writingMode: 'vertical-rl', height: '100px' }}
                        >
                          {name.slice(0, 12)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matrix.names.map((rowName, i) => (
                      <tr key={rowName}>
                        <td className="p-1 border bg-secondary font-medium">
                          {rowName}
                        </td>
                        {matrix.data[i].map((hasLink, j) => (
                          <td 
                            key={j} 
                            className={`p-1 border text-center ${
                              hasLink 
                                ? 'bg-primary/20' 
                                : i === j 
                                  ? 'bg-muted' 
                                  : ''
                            }`}
                          >
                            {hasLink && <Circle className="h-3 w-3 fill-primary text-primary mx-auto" />}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-4">
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {filteredNodes
                  .sort((a, b) => b.dependents.length - a.dependents.length)
                  .map(node => (
                  <div key={node.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{node.name}</span>
                        <Badge className={`${getCategoryColor(node.category)} text-white text-xs`}>
                          {node.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Layers className="h-3 w-3" />
                        Depth: {node.depth}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Dependencies ({node.dependencies.length})
                        </p>
                        {node.dependencies.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {node.dependencies.map(dep => (
                              <Badge 
                                key={dep} 
                                variant="outline" 
                                className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                                onClick={() => setSelectedComponent(dep)}
                              >
                                {dep}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No dependencies</span>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Used By ({node.dependents.length})
                        </p>
                        {node.dependents.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {node.dependents.map(dep => (
                              <Badge 
                                key={dep} 
                                variant="secondary" 
                                className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                                onClick={() => setSelectedComponent(dep)}
                              >
                                {dep}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Not used by other components</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Links</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{links.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Max Depth</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              {Math.max(...nodes.map(n => n.depth))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Most Dependencies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              {Math.max(...nodes.map(n => n.dependencies.length))}
            </p>
            <p className="text-xs text-muted-foreground">
              {nodes.find(n => n.dependencies.length === Math.max(...nodes.map(n => n.dependencies.length)))?.name}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Most Dependents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              {Math.max(...nodes.map(n => n.dependents.length))}
            </p>
            <p className="text-xs text-muted-foreground">
              {nodes.find(n => n.dependents.length === Math.max(...nodes.map(n => n.dependents.length)))?.name}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComponentDependencyGraph;
