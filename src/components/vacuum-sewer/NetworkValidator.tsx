import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Upload, CheckCircle2, AlertTriangle, XCircle, FileJson } from "lucide-react";
import { toast } from "sonner";

interface NetworkNode {
  id: string;
  x: number;
  y: number;
  elevation?: number;
  type?: string;
}

interface NetworkPipe {
  id: string;
  from: string;
  to: string;
  length: number;
  diameter: number;
  flow?: number;
  usInvert?: number;
  dsInvert?: number;
}

interface NetworkConfig {
  nodes: NetworkNode[];
  pipes: NetworkPipe[];
  version?: string;
}

interface ValidationResult {
  level: "error" | "warning" | "info" | "success";
  category: string;
  message: string;
  details?: string;
}

export const NetworkValidator = () => {
  const [network, setNetwork] = useState<NetworkConfig | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setNetwork(json);
        toast.success("Network configuration loaded successfully");
      } catch (error) {
        toast.error("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const validateNetwork = () => {
    if (!network) {
      toast.error("Please upload a network configuration first");
      return;
    }

    setIsValidating(true);
    const results: ValidationResult[] = [];

    // Basic structure validation
    if (!network.nodes || !Array.isArray(network.nodes)) {
      results.push({
        level: "error",
        category: "Structure",
        message: "Invalid network structure: 'nodes' array is missing",
      });
    }

    if (!network.pipes || !Array.isArray(network.pipes)) {
      results.push({
        level: "error",
        category: "Structure",
        message: "Invalid network structure: 'pipes' array is missing",
      });
    }

    // If structure is invalid, stop here
    if (results.some(r => r.level === "error")) {
      setValidationResults(results);
      setIsValidating(false);
      return;
    }

    // Node validation
    const nodeIds = new Set(network.nodes.map(n => n.id));
    if (nodeIds.size !== network.nodes.length) {
      results.push({
        level: "error",
        category: "Nodes",
        message: "Duplicate node IDs detected",
        details: "Each node must have a unique ID",
      });
    }

    // Check for vacuum station
    const hasVacuumStation = network.nodes.some(n => n.type === "vacuumStation");
    if (!hasVacuumStation) {
      results.push({
        level: "warning",
        category: "Nodes",
        message: "No vacuum station defined",
        details: "Network should have at least one node with type='vacuumStation'",
      });
    }

    // Pipe validation
    network.pipes.forEach((pipe, idx) => {
      // Check connectivity
      if (!nodeIds.has(pipe.from)) {
        results.push({
          level: "error",
          category: "Connectivity",
          message: `Pipe ${pipe.id || idx} references non-existent 'from' node: ${pipe.from}`,
        });
      }
      if (!nodeIds.has(pipe.to)) {
        results.push({
          level: "error",
          category: "Connectivity",
          message: `Pipe ${pipe.id || idx} references non-existent 'to' node: ${pipe.to}`,
        });
      }

      // EPA Standard: Diameter validation (typical range 75-150mm)
      if (pipe.diameter < 75) {
        results.push({
          level: "warning",
          category: "EPA Standards",
          message: `Pipe ${pipe.id || idx}: Diameter ${pipe.diameter}mm is below recommended minimum (75mm)`,
          details: "Small diameters may cause blockages in vacuum sewers",
        });
      }
      if (pipe.diameter > 200) {
        results.push({
          level: "warning",
          category: "EPA Standards",
          message: `Pipe ${pipe.id || idx}: Diameter ${pipe.diameter}mm exceeds typical maximum (200mm)`,
          details: "Large diameters may reduce vacuum efficiency",
        });
      }

      // EPA Standard: Flow velocity check
      if (pipe.flow && pipe.diameter) {
        const area = Math.PI * Math.pow(pipe.diameter / 2000, 2); // Convert mm to m
        const velocity = (pipe.flow / 1000) / area; // Convert L/s to m³/s
        
        if (velocity < 0.6) {
          results.push({
            level: "warning",
            category: "EPA Standards",
            message: `Pipe ${pipe.id || idx}: Velocity ${velocity.toFixed(2)} m/s is below minimum (0.6 m/s)`,
            details: "Low velocities may cause solids deposition",
          });
        }
        if (velocity > 6) {
          results.push({
            level: "warning",
            category: "EPA Standards",
            message: `Pipe ${pipe.id || idx}: Velocity ${velocity.toFixed(2)} m/s exceeds maximum (6 m/s)`,
            details: "High velocities may cause excessive wear",
          });
        }
      }

      // EPA Standard: Vacuum head calculation
      if (pipe.usInvert !== undefined && pipe.dsInvert !== undefined) {
        const lift = pipe.dsInvert - pipe.usInvert;
        
        if (lift > 0 && lift > 3.5) {
          results.push({
            level: "error",
            category: "EPA Standards",
            message: `Pipe ${pipe.id || idx}: Lift ${lift.toFixed(2)}m exceeds EPA maximum (3.5m)`,
            details: "Lifts exceeding 3.5m may fail in vacuum operation",
          });
        }

        // Check for reasonable slopes
        const slope = Math.abs(lift / pipe.length);
        if (lift < 0 && slope < 0.001) {
          results.push({
            level: "info",
            category: "Design",
            message: `Pipe ${pipe.id || idx}: Very flat slope (${(slope * 100).toFixed(3)}%)`,
            details: "Consider minimum 0.1% slope for gravity sections",
          });
        }
      }

      // Length validation
      if (pipe.length <= 0) {
        results.push({
          level: "error",
          category: "Geometry",
          message: `Pipe ${pipe.id || idx}: Invalid length (${pipe.length}m)`,
        });
      }
      if (pipe.length > 500) {
        results.push({
          level: "warning",
          category: "Design",
          message: `Pipe ${pipe.id || idx}: Very long pipe (${pipe.length}m)`,
          details: "Consider splitting long pipes for better hydraulic modeling",
        });
      }
    });

    // Calculate cumulative head for complete network paths
    if (hasVacuumStation) {
      const station = network.nodes.find(n => n.type === "vacuumStation");
      if (station) {
        const maxHeads = calculateMaximumHeads(network, station.id);
        maxHeads.forEach(({ nodeId, head }) => {
          if (head > 3.5) {
            results.push({
              level: "error",
              category: "EPA Standards",
              message: `Node ${nodeId}: Cumulative vacuum head ${head.toFixed(2)}m exceeds EPA limit (3.5m)`,
              details: "System may fail to operate at this node",
            });
          } else if (head > 3.0) {
            results.push({
              level: "warning",
              category: "EPA Standards",
              message: `Node ${nodeId}: Cumulative vacuum head ${head.toFixed(2)}m approaching limit`,
              details: "Consider reducing head requirements",
            });
          }
        });
      }
    }

    // Summary
    if (results.length === 0) {
      results.push({
        level: "success",
        category: "Validation",
        message: "Network configuration passes all EPA validation checks",
        details: `${network.nodes.length} nodes and ${network.pipes.length} pipes validated successfully`,
      });
    }

    setValidationResults(results);
    setIsValidating(false);
    toast.success("Validation complete");
  };

  const calculateMaximumHeads = (network: NetworkConfig, stationId: string): { nodeId: string; head: number }[] => {
    // Simple BFS to calculate cumulative head from station upstream
    const heads = new Map<string, number>();
    heads.set(stationId, 0);
    
    const queue = [stationId];
    const processed = new Set<string>();

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (processed.has(currentId)) continue;
      processed.add(currentId);

      const currentHead = heads.get(currentId) || 0;

      // Find all pipes flowing TO this node (upstream pipes)
      const upstreamPipes = network.pipes.filter(p => p.to === currentId);
      
      upstreamPipes.forEach(pipe => {
        let pipeHead = 0;
        
        // Add friction loss (simplified)
        if (pipe.flow && pipe.diameter && pipe.length) {
          const c = 120; // Hazen-Williams coefficient
          const d = pipe.diameter / 1000;
          const q = pipe.flow / 1000;
          pipeHead += 10.67 * pipe.length * Math.pow(q / c, 1.852) * Math.pow(d, -4.87);
        }

        // Add static lift (EPA Sawtooth: only positive)
        if (pipe.usInvert !== undefined && pipe.dsInvert !== undefined) {
          const lift = pipe.dsInvert - pipe.usInvert;
          if (lift > 0) {
            pipeHead += lift;
          }
        }

        const newHead = currentHead + pipeHead;
        const existingHead = heads.get(pipe.from);
        
        if (!existingHead || newHead > existingHead) {
          heads.set(pipe.from, newHead);
          queue.push(pipe.from);
        }
      });
    }

    return Array.from(heads.entries())
      .map(([nodeId, head]) => ({ nodeId, head }))
      .filter(({ nodeId }) => nodeId !== stationId);
  };

  const getResultIcon = (level: ValidationResult["level"]) => {
    switch (level) {
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      default:
        return <FileJson className="h-4 w-4 text-blue-600" />;
    }
  };

  const getResultColor = (level: ValidationResult["level"]) => {
    switch (level) {
      case "error":
        return "destructive";
      case "warning":
        return "default";
      case "success":
        return "default";
      default:
        return "secondary";
    }
  };

  const errorCount = validationResults.filter(r => r.level === "error").length;
  const warningCount = validationResults.filter(r => r.level === "warning").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Configuration Validator</CardTitle>
        <CardDescription>
          Validate imported network configurations against EPA vacuum sewer design standards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <FileJson className="h-4 w-4" />
          <AlertDescription>
            Upload a network JSON file (exported from the simulator or manually created) to validate it against EPA standards including:
            maximum vacuum head (3.5m), pipe diameters, flow velocities, and connectivity.
          </AlertDescription>
        </Alert>

        <div className="flex gap-4 items-center">
          <Button onClick={() => document.getElementById("file-upload")?.click()} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Network JSON
          </Button>
          <input
            id="file-upload"
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          {network && (
            <>
              <Badge variant="outline">
                {network.nodes?.length || 0} nodes
              </Badge>
              <Badge variant="outline">
                {network.pipes?.length || 0} pipes
              </Badge>
            </>
          )}
        </div>

        {network && (
          <Button onClick={validateNetwork} disabled={isValidating} variant="default" className="w-full">
            {isValidating ? "Validating..." : "Run EPA Validation"}
          </Button>
        )}

        {validationResults.length > 0 && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex gap-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-destructive" />
                <span className="font-semibold">{errorCount} Errors</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold">{warningCount} Warnings</span>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {validationResults.map((result, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 p-3 border border-border rounded-lg bg-card"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getResultIcon(result.level)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start gap-2">
                      <Badge variant={getResultColor(result.level)} className="text-xs">
                        {result.category}
                      </Badge>
                      <p className="text-sm font-medium flex-1">{result.message}</p>
                    </div>
                    {result.details && (
                      <p className="text-xs text-muted-foreground">{result.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
