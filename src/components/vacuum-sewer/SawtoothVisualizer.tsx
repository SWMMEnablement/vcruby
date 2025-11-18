import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, RotateCcw } from "lucide-react";

export const SawtoothVisualizer = () => {
  const [params, setParams] = useState({
    runLength: 50,
    runSlope: 0.002,
    liftHeight: 1.5,
    liftLength: 2,
    numSteps: 3,
  });
  
  const [showAnimation, setShowAnimation] = useState(false);

  const canvasWidth = 800;
  const canvasHeight = 300;
  const padding = 40;
  const graphWidth = canvasWidth - 2 * padding;
  const graphHeight = canvasHeight - 2 * padding;

  const totalLength = params.numSteps * (params.runLength + params.liftLength);
  const scaleX = graphWidth / totalLength;
  
  // Calculate max elevation change for scaling
  const maxDrop = params.numSteps * params.runLength * params.runSlope;
  const maxRise = params.numSteps * params.liftHeight;
  const totalRange = maxDrop + maxRise + 2; // Add buffer
  const scaleY = graphHeight / totalRange;

  const generateSawtoothPath = () => {
    const points: { x: number; y: number }[] = [];
    let currentX = 0;
    let currentZ = maxRise; // Start at top for visual clarity
    
    points.push({ x: currentX, y: currentZ });

    for (let i = 0; i < params.numSteps; i++) {
      // Run (downward)
      currentX += params.runLength;
      currentZ -= params.runLength * params.runSlope;
      points.push({ x: currentX, y: currentZ });

      // Lift (upward)
      currentX += params.liftLength;
      currentZ += params.liftHeight;
      points.push({ x: currentX, y: currentZ });
    }

    return points;
  };

  const points = generateSawtoothPath();

  const toScreenX = (x: number) => padding + x * scaleX;
  const toScreenY = (y: number) => canvasHeight - padding - y * scaleY;

  const pathData = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${toScreenX(p.x)} ${toScreenY(p.y)}`
  ).join(' ');

  const handleReset = () => {
    setParams({
      runLength: 50,
      runSlope: 0.002,
      liftHeight: 1.5,
      liftLength: 2,
      numSteps: 3,
    });
    setShowAnimation(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sawtooth Profile Visualizer</CardTitle>
        <CardDescription>
          Interactive visualization of how the sawtooth pattern generator creates alternating run and lift segments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="runLength">Run Length (m)</Label>
            <Input
              id="runLength"
              type="number"
              value={params.runLength}
              onChange={(e) => setParams({ ...params, runLength: parseFloat(e.target.value) || 50 })}
              min="10"
              max="200"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="runSlope">Run Slope (decimal)</Label>
            <Input
              id="runSlope"
              type="number"
              step="0.001"
              value={params.runSlope}
              onChange={(e) => setParams({ ...params, runSlope: parseFloat(e.target.value) || 0.002 })}
              min="0.001"
              max="0.05"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="liftHeight">Lift Height (m)</Label>
            <Input
              id="liftHeight"
              type="number"
              step="0.1"
              value={params.liftHeight}
              onChange={(e) => setParams({ ...params, liftHeight: parseFloat(e.target.value) || 1.5 })}
              min="0.5"
              max="3"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="liftLength">Lift Length (m)</Label>
            <Input
              id="liftLength"
              type="number"
              value={params.liftLength}
              onChange={(e) => setParams({ ...params, liftLength: parseFloat(e.target.value) || 2 })}
              min="1"
              max="10"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="numSteps">Number of Steps</Label>
            <Input
              id="numSteps"
              type="number"
              value={params.numSteps}
              onChange={(e) => setParams({ ...params, numSteps: parseInt(e.target.value) || 3 })}
              min="1"
              max="10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setShowAnimation(!showAnimation)} className="gap-2">
            <Play className="h-4 w-4" />
            {showAnimation ? "Hide" : "Show"} Animation
          </Button>
          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* SVG Visualization */}
        <div className="border border-border rounded-lg bg-background p-4">
          <svg width={canvasWidth} height={canvasHeight} className="w-full">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--muted))" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width={canvasWidth} height={canvasHeight} fill="url(#grid)" />
            
            {/* Axes */}
            <line 
              x1={padding} 
              y1={canvasHeight - padding} 
              x2={canvasWidth - padding} 
              y2={canvasHeight - padding} 
              stroke="hsl(var(--foreground))" 
              strokeWidth="2" 
            />
            <line 
              x1={padding} 
              y1={padding} 
              x2={padding} 
              y2={canvasHeight - padding} 
              stroke="hsl(var(--foreground))" 
              strokeWidth="2" 
            />
            
            {/* Axis labels */}
            <text x={canvasWidth / 2} y={canvasHeight - 5} textAnchor="middle" className="text-xs fill-foreground">
              Distance (m)
            </text>
            <text x={15} y={canvasHeight / 2} textAnchor="middle" transform={`rotate(-90 15 ${canvasHeight / 2})`} className="text-xs fill-foreground">
              Elevation (m)
            </text>

            {/* Sawtooth path */}
            <path
              d={pathData}
              fill="none"
              stroke="hsl(var(--engineering-blue))"
              strokeWidth="3"
              className={showAnimation ? "animate-pulse" : ""}
            />

            {/* Points and labels */}
            {points.map((point, idx) => {
              const isLift = idx > 0 && points[idx - 1] && point.y > points[idx - 1].y;
              const isRun = idx > 0 && points[idx - 1] && point.y < points[idx - 1].y;
              
              return (
                <g key={idx}>
                  <circle
                    cx={toScreenX(point.x)}
                    cy={toScreenY(point.y)}
                    r="4"
                    fill={isLift ? "hsl(var(--destructive))" : isRun ? "hsl(var(--chart-2))" : "hsl(var(--primary))"}
                    stroke="white"
                    strokeWidth="2"
                  />
                  
                  {/* Segment labels */}
                  {idx > 0 && (
                    <text
                      x={(toScreenX(point.x) + toScreenX(points[idx - 1].x)) / 2}
                      y={(toScreenY(point.y) + toScreenY(points[idx - 1].y)) / 2 - 10}
                      textAnchor="middle"
                      className="text-xs font-semibold"
                      fill={isLift ? "hsl(var(--destructive))" : "hsl(var(--chart-2))"}
                    >
                      {isLift ? `↑ Lift ${Math.ceil(idx / 2)}` : `↓ Run ${Math.ceil(idx / 2)}`}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Distance markers */}
            {points.map((point, idx) => (
              <text
                key={`dist-${idx}`}
                x={toScreenX(point.x)}
                y={canvasHeight - padding + 20}
                textAnchor="middle"
                className="text-xs fill-muted-foreground"
              >
                {point.x.toFixed(0)}m
              </text>
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-chart-2" />
            <span>Run (Gravity Flow)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-destructive" />
            <span>Lift (Vacuum Assist)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-1 bg-engineering-blue" />
            <span>Invert Profile</span>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg text-sm">
          <div>
            <div className="text-muted-foreground">Total Length</div>
            <div className="font-semibold">{totalLength.toFixed(1)} m</div>
          </div>
          <div>
            <div className="text-muted-foreground">Total Rise</div>
            <div className="font-semibold">{(params.numSteps * params.liftHeight).toFixed(2)} m</div>
          </div>
          <div>
            <div className="text-muted-foreground">Total Drop</div>
            <div className="font-semibold">{(params.numSteps * params.runLength * params.runSlope).toFixed(2)} m</div>
          </div>
          <div>
            <div className="text-muted-foreground">Net Elevation</div>
            <div className="font-semibold">
              {((params.numSteps * params.liftHeight) - (params.numSteps * params.runLength * params.runSlope)).toFixed(2)} m
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
