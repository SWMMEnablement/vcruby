import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const designFlowSchema = z.object({
  numberOfHomes: z.number().min(1, "Must serve at least 1 home").max(1000, "Maximum 1000 homes"),
});

const hazenWilliamsSchema = z.object({
  flowCoefficient: z.number().min(100, "Coefficient must be at least 100").max(150, "Coefficient must be at most 150"),
  pipeDiameter: z.number().min(2, "Minimum 2 inch diameter").max(12, "Maximum 12 inch diameter"),
  slope: z.number().min(0.001, "Slope must be greater than 0").max(10, "Slope must be reasonable"),
});

const DesignCalculatorTool = () => {
  const { toast } = useToast();
  const [numberOfHomes, setNumberOfHomes] = useState<string>("50");
  const [flowResult, setFlowResult] = useState<number | null>(null);

  const [flowCoefficient, setFlowCoefficient] = useState<string>("140");
  const [pipeDiameter, setPipeDiameter] = useState<string>("4");
  const [slope, setSlope] = useState<string>("0.5");
  const [velocityResult, setVelocityResult] = useState<number | null>(null);
  const [flowCapacity, setFlowCapacity] = useState<number | null>(null);

  const calculateDesignFlow = () => {
    try {
      const N = parseFloat(numberOfHomes);
      
      if (isNaN(N)) {
        toast({
          title: "Invalid Input",
          description: "Please enter a valid number of homes.",
          variant: "destructive",
        });
        return;
      }

      const validated = designFlowSchema.parse({ numberOfHomes: N });
      
      // Q = 0.5N + 20
      const Q = 0.5 * validated.numberOfHomes + 20;
      setFlowResult(Q);

      toast({
        title: "Calculation Complete",
        description: `Design flow calculated successfully: ${Q.toFixed(2)} gpm`,
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

  const calculateHazenWilliams = () => {
    try {
      const C = parseFloat(flowCoefficient);
      const D = parseFloat(pipeDiameter);
      const S = parseFloat(slope) / 100; // Convert percentage to decimal
      
      if (isNaN(C) || isNaN(D) || isNaN(S)) {
        toast({
          title: "Invalid Input",
          description: "Please enter valid numbers for all parameters.",
          variant: "destructive",
        });
        return;
      }

      const validated = hazenWilliamsSchema.parse({ 
        flowCoefficient: C, 
        pipeDiameter: D, 
        slope: S * 100 
      });
      
      // Calculate hydraulic radius R = D/4 (for circular pipe)
      const R = validated.pipeDiameter / 4 / 12; // Convert inches to feet
      
      // V = 1.318 * C * R^0.63 * S^0.54
      const V = 1.318 * validated.flowCoefficient * Math.pow(R, 0.63) * Math.pow(S, 0.54);
      setVelocityResult(V);

      // Calculate flow capacity Q = V * A
      // A = π * (D/2)^2, where D is in feet
      const area = Math.PI * Math.pow((validated.pipeDiameter / 12 / 2), 2);
      const Q = V * area * 448.83; // Convert cubic feet per second to gallons per minute
      setFlowCapacity(Q);

      toast({
        title: "Calculation Complete",
        description: `Velocity: ${V.toFixed(2)} fps, Flow: ${Q.toFixed(2)} gpm`,
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

  const resetCalculations = () => {
    setFlowResult(null);
    setVelocityResult(null);
    setFlowCapacity(null);
    setNumberOfHomes("50");
    setFlowCoefficient("140");
    setPipeDiameter("4");
    setSlope("0.5");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Design Flow Calculator (Equation 5-1)
          </CardTitle>
          <CardDescription>Calculate design flow based on number of dwelling units</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Formula: Q = 0.5N + 20, where Q = Design flow (gpm) and N = Number of homes
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="numberOfHomes">Number of Homes (N)</Label>
              <Input
                id="numberOfHomes"
                type="number"
                value={numberOfHomes}
                onChange={(e) => setNumberOfHomes(e.target.value)}
                placeholder="Enter number of homes"
                min="1"
                max="1000"
              />
              <p className="text-sm text-muted-foreground">Enter value between 1 and 1000</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateDesignFlow} className="flex-1">
                Calculate Flow
              </Button>
              <Button onClick={resetCalculations} variant="outline">
                Reset All
              </Button>
            </div>

            {flowResult !== null && (
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Design Flow (Q)</p>
                <p className="text-3xl font-bold text-primary">{flowResult.toFixed(2)} gpm</p>
                <p className="text-sm text-muted-foreground mt-2">
                  For {numberOfHomes} dwelling units
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Hazen-Williams Calculator (Equation 5-2)
          </CardTitle>
          <CardDescription>Calculate velocity and flow capacity for pipe sizing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Formula: V = 1.318 C R^0.63 S^0.54, where V = Velocity (fps), C = Flow coefficient, 
              R = Hydraulic radius, S = Slope of hydraulic grade line
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="flowCoefficient">Flow Coefficient (C)</Label>
              <Input
                id="flowCoefficient"
                type="number"
                value={flowCoefficient}
                onChange={(e) => setFlowCoefficient(e.target.value)}
                placeholder="Typical: 140"
                min="100"
                max="150"
              />
              <p className="text-sm text-muted-foreground">Typical value: 140 for PVC</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pipeDiameter">Pipe Diameter (inches)</Label>
              <Input
                id="pipeDiameter"
                type="number"
                value={pipeDiameter}
                onChange={(e) => setPipeDiameter(e.target.value)}
                placeholder="Enter diameter"
                min="2"
                max="12"
                step="0.5"
              />
              <p className="text-sm text-muted-foreground">Common sizes: 3, 4, 6, 8 inches</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slope">Slope (%)</Label>
              <Input
                id="slope"
                type="number"
                value={slope}
                onChange={(e) => setSlope(e.target.value)}
                placeholder="Enter slope percentage"
                min="0.001"
                max="10"
                step="0.1"
              />
              <p className="text-sm text-muted-foreground">
                Minimum 0.2% recommended for vacuum systems
              </p>
            </div>
          </div>

          <Button onClick={calculateHazenWilliams} className="w-full">
            Calculate Velocity & Flow
          </Button>

          {velocityResult !== null && flowCapacity !== null && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Velocity (V)</p>
                <p className="text-3xl font-bold text-primary">{velocityResult.toFixed(2)} fps</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {velocityResult >= 2 ? "✓ Meets minimum 2 fps" : "⚠ Below minimum 2 fps"}
                </p>
              </div>

              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Flow Capacity (Q)</p>
                <p className="text-3xl font-bold text-primary">{flowCapacity.toFixed(2)} gpm</p>
                <p className="text-sm text-muted-foreground mt-2">
                  For {pipeDiameter}" diameter pipe
                </p>
              </div>
            </div>
          )}

          {velocityResult !== null && (
            <Alert className={velocityResult >= 2 ? "border-primary" : "border-destructive"}>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {velocityResult >= 3 ? (
                  "Excellent: Velocity exceeds recommended 3 fps for optimal scouring."
                ) : velocityResult >= 2 ? (
                  "Acceptable: Velocity meets minimum 2 fps requirement for grinder pumps."
                ) : (
                  "Warning: Velocity below minimum 2 fps. Consider increasing slope or decreasing pipe diameter."
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Reference Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 border border-border rounded-lg">
              <h4 className="font-semibold mb-2">Minimum Velocities</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Grinder pumps: 2 fps minimum</li>
                <li>• Preferred: 3 fps for optimal scouring</li>
                <li>• Self-cleaning systems: velocity not critical</li>
              </ul>
            </div>
            <div className="p-3 border border-border rounded-lg">
              <h4 className="font-semibold mb-2">Typical Parameters</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Flow coefficient (C): 140 for PVC</li>
                <li>• Minimum slope: 0.2% (1 in 500)</li>
                <li>• Common pipe sizes: 3", 4", 6", 8"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignCalculatorTool;
