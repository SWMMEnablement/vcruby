import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, AlertCircle, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const calculatorSchema = z.object({
  flowLps: z.number().min(0.1, "Flow must be at least 0.1 L/s").max(100, "Flow must be less than 100 L/s"),
  diameterMm: z.number().min(50, "Diameter must be at least 50 mm").max(500, "Diameter must be less than 500 mm"),
  lengthM: z.number().min(1, "Length must be at least 1 m").max(10000, "Length must be less than 10,000 m"),
  cFactorWater: z.number().min(80, "C-factor must be at least 80").max(150, "C-factor must be less than 150"),
  lockhartMultiplier: z.number().min(1, "Multiplier must be at least 1").max(5, "Multiplier must be less than 5"),
});

export const FrictionComparisonCalculator = () => {
  const { toast } = useToast();
  const [inputs, setInputs] = useState({
    flowLps: 5.0,
    diameterMm: 110,
    lengthM: 100,
    cFactorWater: 140,
    lockhartMultiplier: 3.0,
  });

  const [results, setResults] = useState<{
    waterHeadloss: number;
    waterVelocity: number;
    waterCFactor: number;
    vacuumHeadloss: number;
    vacuumVelocity: number;
    vacuumCFactor: number;
    headlossDifference: number;
    percentageIncrease: number;
  } | null>(null);

  const calculateHeadloss = () => {
    try {
      // Validate inputs
      calculatorSchema.parse(inputs);

      const { flowLps, diameterMm, lengthM, cFactorWater, lockhartMultiplier } = inputs;

      // Convert units
      const qCms = flowLps / 1000.0; // L/s to m³/s
      const dM = diameterMm / 1000.0; // mm to m

      // Calculate pipe area and velocity
      const area = Math.PI * Math.pow(dM / 2, 2);
      const velocity = qCms / area;

      // Standard Water Flow (Single-Phase)
      // Hazen-Williams Metric: h_f = 10.67 * L * (Q^1.852) / (C^1.852 * D^4.87)
      const waterHeadloss = 10.67 * lengthM * Math.pow(qCms, 1.852) / 
                            (Math.pow(cFactorWater, 1.852) * Math.pow(dM, 4.87));

      // Two-Phase Vacuum Flow
      // Apply Lockhart-Martinelli multiplier: ΔP_TP = Φ_L² · ΔP_L
      const vacuumHeadloss = waterHeadloss * Math.pow(lockhartMultiplier, 2);

      // Calculate equivalent C-factor for vacuum that would produce the same headloss
      // Rearrange: C = (10.67 * L * Q^1.852 / (h_f * D^4.87))^(1/1.852)
      const vacuumCFactor = Math.pow(
        (10.67 * lengthM * Math.pow(qCms, 1.852)) / (vacuumHeadloss * Math.pow(dM, 4.87)),
        1 / 1.852
      );

      const headlossDifference = vacuumHeadloss - waterHeadloss;
      const percentageIncrease = ((vacuumHeadloss - waterHeadloss) / waterHeadloss) * 100;

      setResults({
        waterHeadloss,
        waterVelocity: velocity,
        waterCFactor: cFactorWater,
        vacuumHeadloss,
        vacuumVelocity: velocity, // Same flow, same velocity
        vacuumCFactor,
        headlossDifference,
        percentageIncrease,
      });

      toast({
        title: "Calculation Complete",
        description: `Two-phase flow increases headloss by ${percentageIncrease.toFixed(1)}%`,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This calculator demonstrates the <strong>Lockhart-Martinelli two-phase flow effect</strong>. 
          It compares headloss in standard single-phase water flow versus two-phase air-liquid vacuum flow using the same pipe geometry and flow rate.
        </AlertDescription>
      </Alert>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Input Parameters</CardTitle>
            <CardDescription>
              Enter pipe and flow characteristics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="flowLps">
                Flow Rate (L/s)
                <span className="text-xs text-muted-foreground ml-2">Liquid flow only</span>
              </Label>
              <Input
                id="flowLps"
                type="number"
                value={inputs.flowLps}
                onChange={(e) => setInputs({ ...inputs, flowLps: parseFloat(e.target.value) || 0 })}
                step="0.1"
                min="0.1"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diameterMm">Pipe Diameter (mm)</Label>
              <select
                id="diameterMm"
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={inputs.diameterMm}
                onChange={(e) => setInputs({ ...inputs, diameterMm: parseInt(e.target.value) })}
              >
                <option value="90">90 mm (3.5")</option>
                <option value="110">110 mm (4")</option>
                <option value="160">160 mm (6")</option>
                <option value="200">200 mm (8")</option>
                <option value="250">250 mm (10")</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lengthM">Pipe Length (m)</Label>
              <Input
                id="lengthM"
                type="number"
                value={inputs.lengthM}
                onChange={(e) => setInputs({ ...inputs, lengthM: parseFloat(e.target.value) || 0 })}
                step="10"
                min="1"
                max="10000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cFactorWater">
                Hazen-Williams C-Factor (Water)
                <span className="text-xs text-muted-foreground ml-2">Standard single-phase</span>
              </Label>
              <Input
                id="cFactorWater"
                type="number"
                value={inputs.cFactorWater}
                onChange={(e) => setInputs({ ...inputs, cFactorWater: parseInt(e.target.value) || 0 })}
                step="5"
                min="80"
                max="150"
              />
              <p className="text-xs text-muted-foreground">
                Typical: PVC = 140-150, Cast Iron = 100-130
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lockhartMultiplier">
                Lockhart-Martinelli Multiplier (Φ<sub>L</sub>)
                <span className="text-xs text-muted-foreground ml-2">Two-phase effect</span>
              </Label>
              <Input
                id="lockhartMultiplier"
                type="number"
                value={inputs.lockhartMultiplier}
                onChange={(e) => setInputs({ ...inputs, lockhartMultiplier: parseFloat(e.target.value) || 0 })}
                step="0.1"
                min="1"
                max="5"
              />
              <p className="text-xs text-muted-foreground">
                Typical vacuum range: 2.0 - 4.0 (Higher = more air interaction)
              </p>
            </div>

            <Button onClick={calculateHeadloss} className="w-full">
              Calculate Comparison
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="space-y-4">
          {results ? (
            <>
              {/* Standard Water Flow Results */}
              <Card className="border-blue-500/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    Standard Water Flow (Single-Phase)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-secondary rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Headloss</p>
                      <p className="text-xl font-bold text-blue-500">
                        {results.waterHeadloss.toFixed(4)} m
                      </p>
                    </div>
                    <div className="p-3 bg-secondary rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Velocity</p>
                      <p className="text-xl font-bold text-blue-500">
                        {results.waterVelocity.toFixed(2)} m/s
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">C-Factor (Input)</p>
                    <p className="text-lg font-semibold">
                      {results.waterCFactor}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Two-Phase Vacuum Flow Results */}
              <Card className="border-engineering-blue/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-engineering-blue"></div>
                    Two-Phase Vacuum Flow
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-secondary rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Headloss</p>
                      <p className="text-xl font-bold text-engineering-blue">
                        {results.vacuumHeadloss.toFixed(4)} m
                      </p>
                    </div>
                    <div className="p-3 bg-secondary rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Velocity</p>
                      <p className="text-xl font-bold text-engineering-blue">
                        {results.vacuumVelocity.toFixed(2)} m/s
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Equivalent C-Factor</p>
                    <p className="text-lg font-semibold text-engineering-blue">
                      {results.vacuumCFactor.toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use this value in ICM to model vacuum behavior
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Comparison Results */}
              <Card className="border-yellow-500/50 bg-yellow-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-yellow-500" />
                    Impact Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Additional Headloss</p>
                      <p className="text-2xl font-bold text-yellow-500">
                        +{results.headlossDifference.toFixed(4)} m
                      </p>
                    </div>
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Percentage Increase</p>
                      <p className="text-2xl font-bold text-yellow-500">
                        {results.percentageIncrease.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-background rounded-lg border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Water C-Factor</span>
                      <Badge variant="outline">{results.waterCFactor}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-blue-500 rounded"></div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm">Vacuum C-Factor (Reduced)</span>
                      <Badge variant="outline" className="bg-engineering-blue/20">
                        {results.vacuumCFactor.toFixed(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-2 bg-engineering-blue rounded"
                        style={{ 
                          width: `${(results.vacuumCFactor / results.waterCFactor) * 100}%` 
                        }}
                      ></div>
                      <div 
                        className="h-2 bg-yellow-500/30 rounded flex-1"
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>C-Factor Reduction: {((1 - results.vacuumCFactor / results.waterCFactor) * 100).toFixed(1)}%</strong>
                      {" "}to account for two-phase flow effects
                    </p>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>ICM Modeling Recommendation:</strong> Use C-Factor of <strong>{results.vacuumCFactor.toFixed(0)}</strong> instead of {results.waterCFactor} to accurately model vacuum sewer headloss with the Lockhart-Martinelli multiplier of {inputs.lockhartMultiplier}.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Theory Explanation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Understanding the Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong>Why is headloss higher in vacuum sewers?</strong> The air phase travels at much higher velocity than the liquid, creating turbulent shear stress at the air-water interface. This significantly increases effective friction.
                  </p>
                  <p>
                    <strong>The Lockhart-Martinelli Correlation:</strong> ΔP<sub>TP</sub> = Φ<sub>L</sub>² · ΔP<sub>L</sub>
                  </p>
                  <p>
                    Where Φ<sub>L</sub> is the two-phase multiplier (typically 2-4 for vacuum sewers). The squared relationship means small changes in air interaction cause large headloss increases.
                  </p>
                  <p>
                    <strong>Practical Application:</strong> Since InfoWorks ICM cannot directly model two-phase flow, we "penalize" the C-factor to artificially increase calculated headloss, matching observed vacuum system behavior.
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">
                  Enter parameters and click "Calculate Comparison" to see results
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
