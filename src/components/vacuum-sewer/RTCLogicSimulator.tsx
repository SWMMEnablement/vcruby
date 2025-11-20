import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { Play, AlertCircle, CheckCircle2, Info } from "lucide-react";

interface SimulationPoint {
  time: number;
  sumpLevel: number;
  valveOpen: boolean;
  airActive: boolean;
  activeValves: number;
}

interface ValidationIssue {
  type: "error" | "warning" | "info";
  message: string;
}

export const RTCLogicSimulator = () => {
  const [config, setConfig] = useState({
    valveName: "VS_001",
    onLevel: 0.5,
    offLevel: 0.2,
    airTime: 2.0,
    maxActiveValves: 3,
    inflowRate: 0.1,
    sumpArea: 1.0,
    simulationTime: 60
  });

  const [simulation, setSimulation] = useState<SimulationPoint[]>([]);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runSimulation = () => {
    setIsRunning(true);
    const points: SimulationPoint[] = [];
    const validationIssues: ValidationIssue[] = [];
    
    let currentLevel = 0;
    let valveOpen = false;
    let airActive = false;
    let airEndTime = 0;
    let activeValvesCount = 1;
    let cycleCount = 0;
    let totalOnTime = 0;
    let lastOnTime = 0;

    const dt = 0.1; // Time step in seconds
    const steps = Math.floor(config.simulationTime / dt);

    for (let i = 0; i <= steps; i++) {
      const time = i * dt;

      // Update sump level
      if (valveOpen) {
        // Draining (negative flow)
        currentLevel -= 0.05 * dt / config.sumpArea;
      } else {
        // Filling
        currentLevel += config.inflowRate * dt / config.sumpArea;
      }

      // Bound the level
      currentLevel = Math.max(0, Math.min(1, currentLevel));

      // RTC Logic - Valve control
      if (!valveOpen && currentLevel >= config.onLevel) {
        // Turn valve ON
        valveOpen = true;
        airActive = true;
        airEndTime = time + config.airTime;
        lastOnTime = time;
        cycleCount++;
      } else if (valveOpen && currentLevel <= config.offLevel) {
        // Turn valve OFF
        valveOpen = false;
        totalOnTime += (time - lastOnTime);
      }

      // Air admission control
      if (airActive && time >= airEndTime) {
        airActive = false;
      }

      // Record point every second
      if (i % 10 === 0) {
        points.push({
          time: parseFloat(time.toFixed(1)),
          sumpLevel: parseFloat((currentLevel * 100).toFixed(1)),
          valveOpen,
          airActive,
          activeValves: valveOpen ? activeValvesCount : 0
        });
      }
    }

    // Validation checks
    if (config.onLevel <= config.offLevel) {
      validationIssues.push({
        type: "error",
        message: "On level must be greater than off level"
      });
    }

    if (config.airTime < 1) {
      validationIssues.push({
        type: "warning",
        message: "Air time below 1 second may not provide sufficient air admission"
      });
    }

    if (config.airTime > 5) {
      validationIssues.push({
        type: "warning",
        message: "Air time above 5 seconds may waste energy"
      });
    }

    if (cycleCount > 0) {
      const avgCycleTime = config.simulationTime / cycleCount;
      if (avgCycleTime < 10) {
        validationIssues.push({
          type: "warning",
          message: `High cycling frequency (${cycleCount} cycles in ${config.simulationTime}s). Consider adjusting levels.`
        });
      }
      
      validationIssues.push({
        type: "info",
        message: `Simulation completed: ${cycleCount} valve cycles, ${(totalOnTime / config.simulationTime * 100).toFixed(1)}% duty cycle`
      });
    } else {
      validationIssues.push({
        type: "info",
        message: "No valve cycles occurred during simulation"
      });
    }

    setSimulation(points);
    setIssues(validationIssues);
    setIsRunning(false);
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "error": return <AlertCircle className="h-4 w-4" />;
      case "warning": return <AlertCircle className="h-4 w-4" />;
      case "info": return <Info className="h-4 w-4" />;
      default: return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  const getIssueVariant = (type: string): "default" | "destructive" => {
    return type === "error" ? "destructive" : "default";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>RTC Logic Simulator</CardTitle>
          <CardDescription>
            Test and validate pneumatic valve controller logic with visual timeline
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valveName">Valve Name</Label>
              <Input
                id="valveName"
                value={config.valveName}
                onChange={(e) => setConfig({ ...config, valveName: e.target.value })}
                placeholder="VS_001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="onLevel">On Level (m)</Label>
              <Input
                id="onLevel"
                type="number"
                step="0.1"
                value={config.onLevel}
                onChange={(e) => setConfig({ ...config, onLevel: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="offLevel">Off Level (m)</Label>
              <Input
                id="offLevel"
                type="number"
                step="0.1"
                value={config.offLevel}
                onChange={(e) => setConfig({ ...config, offLevel: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="airTime">Air Admission Time (s)</Label>
              <Input
                id="airTime"
                type="number"
                step="0.5"
                value={config.airTime}
                onChange={(e) => setConfig({ ...config, airTime: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inflowRate">Inflow Rate (m³/s)</Label>
              <Input
                id="inflowRate"
                type="number"
                step="0.01"
                value={config.inflowRate}
                onChange={(e) => setConfig({ ...config, inflowRate: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sumpArea">Sump Area (m²)</Label>
              <Input
                id="sumpArea"
                type="number"
                step="0.1"
                value={config.sumpArea}
                onChange={(e) => setConfig({ ...config, sumpArea: parseFloat(e.target.value) || 1 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxActiveValves">Max Active Valves</Label>
              <Input
                id="maxActiveValves"
                type="number"
                value={config.maxActiveValves}
                onChange={(e) => setConfig({ ...config, maxActiveValves: parseInt(e.target.value) || 1 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="simulationTime">Simulation Time (s)</Label>
              <Input
                id="simulationTime"
                type="number"
                value={config.simulationTime}
                onChange={(e) => setConfig({ ...config, simulationTime: parseInt(e.target.value) || 60 })}
              />
            </div>
          </div>

          <Button onClick={runSimulation} disabled={isRunning} className="w-full">
            <Play className="mr-2 h-4 w-4" />
            {isRunning ? "Running Simulation..." : "Run Simulation"}
          </Button>
        </CardContent>
      </Card>

      {issues.length > 0 && (
        <div className="space-y-2">
          {issues.map((issue, index) => (
            <Alert key={index} variant={getIssueVariant(issue.type)}>
              <div className="flex items-start gap-2">
                {getIssueIcon(issue.type)}
                <AlertDescription>{issue.message}</AlertDescription>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {simulation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Simulation Timeline</CardTitle>
            <CardDescription>
              Visual representation of valve cycles and sump levels over time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={simulation}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="time" 
                    label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }}
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    label={{ value: 'Sump Level (%)', angle: -90, position: 'insideLeft' }}
                    className="text-muted-foreground"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Legend />
                  <ReferenceLine 
                    y={config.onLevel * 100} 
                    stroke="hsl(var(--destructive))" 
                    strokeDasharray="5 5" 
                    label="On Level" 
                  />
                  <ReferenceLine 
                    y={config.offLevel * 100} 
                    stroke="hsl(var(--primary))" 
                    strokeDasharray="5 5" 
                    label="Off Level" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sumpLevel" 
                    stroke="hsl(var(--chart-1))" 
                    name="Sump Level (%)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Valve State Timeline</h4>
              <div className="flex flex-wrap gap-2">
                {simulation.map((point, index) => {
                  const width = index < simulation.length - 1 
                    ? `${((simulation[index + 1].time - point.time) / config.simulationTime) * 100}%`
                    : '2%';
                  
                  return (
                    <div
                      key={index}
                      className="relative group"
                      style={{ width }}
                    >
                      <div
                        className={`h-8 rounded transition-colors ${
                          point.valveOpen
                            ? point.airActive
                              ? 'bg-destructive'
                              : 'bg-primary'
                            : 'bg-muted'
                        }`}
                        title={`${point.time}s: ${point.valveOpen ? (point.airActive ? 'OPEN + AIR' : 'OPEN') : 'CLOSED'}`}
                      />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10 border">
                        {point.time}s: {point.valveOpen ? (point.airActive ? 'OPEN + AIR' : 'OPEN') : 'CLOSED'}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-muted rounded" />
                  <span className="text-muted-foreground">Closed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary rounded" />
                  <span className="text-muted-foreground">Open</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-destructive rounded" />
                  <span className="text-muted-foreground">Open + Air</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-primary">
                    {simulation.filter(p => p.valveOpen !== simulation[Math.max(0, simulation.indexOf(p) - 1)]?.valveOpen).length / 2}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Cycles</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-primary">
                    {((simulation.filter(p => p.valveOpen).length / simulation.length) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Duty Cycle</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-primary">
                    {simulation.filter(p => p.airActive).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Air Events</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-primary">
                    {Math.max(...simulation.map(p => p.sumpLevel)).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Peak Level</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
