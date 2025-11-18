import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitCompare, Check, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SystemComparison = () => {
  const [params, setParams] = useState({
    numHomes: 100,
    avgDepth: 8, // feet
    totalLength: 6000, // feet
    terrain: "flat", // flat, rolling, rocky
    waterTable: "high", // high, normal, low
  });

  const [comparison, setComparison] = useState<any>(null);

  const calculateComparison = () => {
    const inflation = 2.1;
    
    // VACUUM SEWER COSTS
    const vacuumMainCost = params.totalLength * (65 * inflation); // 6" main
    const vacuumServiceCost = params.numHomes * 150 * (35 * inflation);
    const vacuumValvePits = Math.ceil(params.numHomes / 4) * (3500 * inflation);
    const vacuumStation = 175000 * inflation;
    const vacuumExcavation = params.totalLength * (15 * inflation); // Shallow (3-4 ft)
    const vacuumTotal = vacuumMainCost + vacuumServiceCost + vacuumValvePits + vacuumStation + vacuumExcavation;
    const vacuumOM = params.numHomes * (45 * inflation) + vacuumValvePits * 0.15 + 35000 * inflation;

    // GRAVITY SEWER COSTS
    const gravityMainCost = params.totalLength * (85 * inflation); // 8" main
    const gravityServiceCost = params.numHomes * 150 * (40 * inflation);
    const gravityExcavation = params.totalLength * (35 * inflation); // Deep (8-12 ft)
    const gravityManholes = Math.ceil(params.totalLength / 400) * (4500 * inflation);
    const gravityLiftStations = params.terrain === "flat" ? 3 * (150000 * inflation) : 0;
    const gravityTotal = gravityMainCost + gravityServiceCost + gravityExcavation + gravityManholes + gravityLiftStations;
    const gravityOM = gravityLiftStations > 0 ? (75000 * inflation) : (15000 * inflation);

    // PRESSURE SEWER COSTS
    const pressureMainCost = params.totalLength * (55 * inflation); // 4" pressure main
    const pressureServiceCost = params.numHomes * 150 * (30 * inflation);
    const pressureGrinderPumps = params.numHomes * (3200 * inflation);
    const pressureExcavation = params.totalLength * (18 * inflation); // Shallow
    const pressureTotal = pressureMainCost + pressureServiceCost + pressureGrinderPumps + pressureExcavation;
    const pressureOM = params.numHomes * (85 * inflation); // Higher power costs

    // Terrain & site condition adjustments
    const terrainMultiplier = params.terrain === "rocky" ? 1.4 : params.terrain === "rolling" ? 1.15 : 1.0;
    const waterTableSavings = params.waterTable === "high" ? 0.85 : 1.0; // Vacuum benefits from high water table

    setComparison({
      vacuum: {
        capital: (vacuumTotal * waterTableSavings).toFixed(0),
        perHome: (vacuumTotal * waterTableSavings / params.numHomes).toFixed(0),
        om: vacuumOM.toFixed(0),
        excavation: "3-4 ft",
        lifeCycle20yr: (vacuumTotal * waterTableSavings + vacuumOM * 20).toFixed(0),
      },
      gravity: {
        capital: (gravityTotal * terrainMultiplier).toFixed(0),
        perHome: (gravityTotal * terrainMultiplier / params.numHomes).toFixed(0),
        om: gravityOM.toFixed(0),
        excavation: "8-12 ft",
        lifeCycle20yr: (gravityTotal * terrainMultiplier + gravityOM * 20).toFixed(0),
      },
      pressure: {
        capital: pressureTotal.toFixed(0),
        perHome: (pressureTotal / params.numHomes).toFixed(0),
        om: pressureOM.toFixed(0),
        excavation: "4-5 ft",
        lifeCycle20yr: (pressureTotal + pressureOM * 20).toFixed(0),
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-6 w-6 text-engineering-blue" />
            System Cost & Benefit Comparison
          </CardTitle>
          <CardDescription>Compare vacuum, gravity, and pressure sewers for your project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numHomes">Number of Homes</Label>
              <Input
                id="numHomes"
                type="number"
                value={params.numHomes}
                onChange={(e) => setParams({...params, numHomes: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalLength">Total System Length (ft)</Label>
              <Input
                id="totalLength"
                type="number"
                value={params.totalLength}
                onChange={(e) => setParams({...params, totalLength: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avgDepth">Terrain Type</Label>
              <select 
                id="terrain"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={params.terrain}
                onChange={(e) => setParams({...params, terrain: e.target.value})}
              >
                <option value="flat">Flat</option>
                <option value="rolling">Rolling</option>
                <option value="rocky">Rocky</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="waterTable">Water Table</Label>
              <select 
                id="waterTable"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={params.waterTable}
                onChange={(e) => setParams({...params, waterTable: e.target.value})}
              >
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <Button onClick={calculateComparison} className="w-full">
            Compare Systems
          </Button>

          {comparison && (
            <Tabs defaultValue="costs" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="costs">Costs</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="suitability">Best Use Cases</TabsTrigger>
              </TabsList>

              <TabsContent value="costs" className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="border-2 border-engineering-blue">
                    <CardHeader>
                      <CardTitle className="text-lg text-engineering-blue">Vacuum Sewer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Capital Cost</p>
                        <p className="text-2xl font-bold">${parseInt(comparison.vacuum.capital).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">${parseInt(comparison.vacuum.perHome).toLocaleString()}/home</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Annual O&M</p>
                        <p className="text-xl font-semibold">${parseInt(comparison.vacuum.om).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">20-Year Life Cycle</p>
                        <p className="text-xl font-semibold">${parseInt(comparison.vacuum.lifeCycle20yr).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Excavation Depth</p>
                        <Badge variant="outline">{comparison.vacuum.excavation}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-engineering-teal">
                    <CardHeader>
                      <CardTitle className="text-lg text-engineering-teal">Gravity Sewer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Capital Cost</p>
                        <p className="text-2xl font-bold">${parseInt(comparison.gravity.capital).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">${parseInt(comparison.gravity.perHome).toLocaleString()}/home</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Annual O&M</p>
                        <p className="text-xl font-semibold">${parseInt(comparison.gravity.om).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">20-Year Life Cycle</p>
                        <p className="text-xl font-semibold">${parseInt(comparison.gravity.lifeCycle20yr).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Excavation Depth</p>
                        <Badge variant="outline">{comparison.gravity.excavation}</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-accent">
                    <CardHeader>
                      <CardTitle className="text-lg text-accent">Pressure Sewer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Capital Cost</p>
                        <p className="text-2xl font-bold">${parseInt(comparison.pressure.capital).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">${parseInt(comparison.pressure.perHome).toLocaleString()}/home</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Annual O&M</p>
                        <p className="text-xl font-semibold">${parseInt(comparison.pressure.om).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">20-Year Life Cycle</p>
                        <p className="text-xl font-semibold">${parseInt(comparison.pressure.lifeCycle20yr).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Excavation Depth</p>
                        <Badge variant="outline">{comparison.pressure.excavation}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Cost estimates include terrain and water table adjustments. Actual costs vary by location and site conditions.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="features" className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-engineering-blue">Vacuum Sewer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>No power at each home</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>Shallow trenching (3-4 ft)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>Works in flat terrain</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>Good for high water table</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>Central station maintenance</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="h-4 w-4 text-destructive mt-0.5" />
                        <span>Requires vacuum station</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="h-4 w-4 text-destructive mt-0.5" />
                        <span>Air/water management needed</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-engineering-teal">Gravity Sewer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>No power required</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>Proven technology</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>Long service life</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>Low O&M (if no pumps)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="h-4 w-4 text-destructive mt-0.5" />
                        <span>Deep excavation (8-12 ft)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="h-4 w-4 text-destructive mt-0.5" />
                        <span>Needs slope (0.4% minimum)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="h-4 w-4 text-destructive mt-0.5" />
                        <span>Lift stations in flat areas</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="h-4 w-4 text-destructive mt-0.5" />
                        <span>Infiltration issues</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-accent">Pressure Sewer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>Shallow trenching (4-5 ft)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>Works in any terrain</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>Small diameter pipes</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>Flexible routing</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="h-4 w-4 text-destructive mt-0.5" />
                        <span>Pump at each home</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="h-4 w-4 text-destructive mt-0.5" />
                        <span>High power costs</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="h-4 w-4 text-destructive mt-0.5" />
                        <span>Homeowner maintenance</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="h-4 w-4 text-destructive mt-0.5" />
                        <span>Pump replacement costs</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="suitability" className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="border-l-4 border-l-engineering-blue">
                    <CardHeader>
                      <CardTitle className="text-base">Choose Vacuum When:</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>• Flat terrain (no natural slope)</p>
                      <p>• High water table conditions</p>
                      <p>• Rocky or difficult soil</p>
                      <p>• Low to medium density (50-200 homes)</p>
                      <p>• Environmentally sensitive areas</p>
                      <p>• Retrofit situations</p>
                      <p>• Coastal or flood-prone areas</p>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-engineering-teal">
                    <CardHeader>
                      <CardTitle className="text-base">Choose Gravity When:</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>• Natural slope available (0.4%+)</p>
                      <p>• Low water table</p>
                      <p>• Good soil conditions</p>
                      <p>• High density development</p>
                      <p>• New construction</p>
                      <p>• Long-term lowest O&M desired</p>
                      <p>• Traditional infrastructure preferred</p>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-accent">
                    <CardHeader>
                      <CardTitle className="text-base">Choose Pressure When:</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>• Scattered/rural development</p>
                      <p>• Extreme topography</p>
                      <p>• Very low density</p>
                      <p>• Small communities (&lt;50 homes)</p>
                      <p>• Individual homeowner responsibility OK</p>
                      <p>• Phased development planned</p>
                      <p>• Minimal central infrastructure</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemComparison;