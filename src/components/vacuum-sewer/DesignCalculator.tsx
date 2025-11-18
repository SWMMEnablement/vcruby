import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, TrendingUp } from "lucide-react";

const DesignCalculator = () => {
  const [pipeSizing, setPipeSizing] = useState({
    numHomes: 50,
    avgFlow: 350, // gpd per home
    peakingFactor: 3.0,
    pipeLength: 1000, // feet
  });

  const [pumpSizing, setPumpSizing] = useState({
    totalHomes: 100,
    avgDailyFlow: 35000, // gpd
    vacuumLevel: 18, // inches Hg
  });

  const [results, setResults] = useState<any>(null);

  const calculatePipeSize = () => {
    const totalAvgFlow = pipeSizing.numHomes * pipeSizing.avgFlow;
    const peakFlow = totalAvgFlow * pipeSizing.peakingFactor;
    const peakFlowGPM = peakFlow / 1440; // Convert gpd to gpm

    // EPA guidelines for vacuum sewer pipe sizing
    let recommendedDiameter = 3;
    let maxHomes = 0;
    
    if (pipeSizing.numHomes <= 20) {
      recommendedDiameter = 3;
      maxHomes = 20;
    } else if (pipeSizing.numHomes <= 50) {
      recommendedDiameter = 4;
      maxHomes = 50;
    } else if (pipeSizing.numHomes <= 100) {
      recommendedDiameter = 6;
      maxHomes = 100;
    } else {
      recommendedDiameter = 8;
      maxHomes = 200;
    }

    // Friction loss calculation (simplified Darcy-Weisbach)
    const velocity = 16; // ft/sec typical for vacuum sewers
    const frictionFactor = 0.015;
    const frictionLoss = (frictionFactor * pipeSizing.pipeLength * Math.pow(velocity, 2)) / 
                         (2 * 32.2 * (recommendedDiameter / 12));

    setResults({
      totalAvgFlow: totalAvgFlow.toFixed(0),
      peakFlow: peakFlow.toFixed(0),
      peakFlowGPM: peakFlowGPM.toFixed(2),
      recommendedDiameter,
      maxHomes,
      frictionLoss: frictionLoss.toFixed(2),
      velocity,
    });
  };

  const calculatePumpSize = () => {
    const peakFlow = pumpSizing.avgDailyFlow * 3.0; // Typical peaking factor
    const peakFlowGPM = peakFlow / 1440;
    
    // Vacuum pump sizing using "A" factor method from EPA manual
    const aFactor = 1.3; // Typical for residential systems
    const vacuumPumpCFM = peakFlowGPM * aFactor;
    
    // Collection tank sizing (15-minute storage at peak flow)
    const tankVolume = (peakFlowGPM * 15) / 7.48; // Convert to cubic feet
    
    // Discharge pump sizing
    const dischargePumpGPM = peakFlowGPM * 1.5; // Safety factor
    const dischargePumpHP = (dischargePumpGPM * 30) / 3960; // Assuming 30 ft TDH

    setResults({
      peakFlowGPD: peakFlow.toFixed(0),
      peakFlowGPM: peakFlowGPM.toFixed(2),
      vacuumPumpCFM: vacuumPumpCFM.toFixed(1),
      tankVolume: tankVolume.toFixed(0),
      dischargePumpGPM: dischargePumpGPM.toFixed(1),
      dischargePumpHP: dischargePumpHP.toFixed(2),
      recommendedVacuumLevel: pumpSizing.vacuumLevel,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-engineering-blue" />
            Design Calculations
          </CardTitle>
          <CardDescription>Chapter 3.4 - System Design Considerations</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="pipe" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pipe">Pipe Sizing</TabsTrigger>
          <TabsTrigger value="pump">Pump Sizing</TabsTrigger>
        </TabsList>

        <TabsContent value="pipe" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Main Line Pipe Sizing Calculator</CardTitle>
              <CardDescription>Based on EPA Table 3-2: Main Line Design Parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numHomes">Number of Homes Served</Label>
                  <Input
                    id="numHomes"
                    type="number"
                    value={pipeSizing.numHomes}
                    onChange={(e) => setPipeSizing({...pipeSizing, numHomes: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avgFlow">Average Flow per Home (gpd)</Label>
                  <Input
                    id="avgFlow"
                    type="number"
                    value={pipeSizing.avgFlow}
                    onChange={(e) => setPipeSizing({...pipeSizing, avgFlow: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="peakingFactor">Peaking Factor</Label>
                  <Input
                    id="peakingFactor"
                    type="number"
                    step="0.1"
                    value={pipeSizing.peakingFactor}
                    onChange={(e) => setPipeSizing({...pipeSizing, peakingFactor: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pipeLength">Pipe Length (feet)</Label>
                  <Input
                    id="pipeLength"
                    type="number"
                    value={pipeSizing.pipeLength}
                    onChange={(e) => setPipeSizing({...pipeSizing, pipeLength: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <Button onClick={calculatePipeSize} className="w-full">
                Calculate Pipe Size
              </Button>

              {results && results.recommendedDiameter && (
                <div className="space-y-4 p-4 bg-secondary rounded-lg">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Design Results
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-card rounded border border-border">
                      <p className="text-sm text-muted-foreground">Total Average Flow</p>
                      <p className="text-2xl font-bold text-primary">{results.totalAvgFlow} gpd</p>
                    </div>
                    <div className="p-3 bg-card rounded border border-border">
                      <p className="text-sm text-muted-foreground">Peak Flow</p>
                      <p className="text-2xl font-bold text-primary">{results.peakFlow} gpd</p>
                    </div>
                    <div className="p-3 bg-card rounded border border-border">
                      <p className="text-sm text-muted-foreground">Peak Flow Rate</p>
                      <p className="text-2xl font-bold text-primary">{results.peakFlowGPM} gpm</p>
                    </div>
                    <div className="p-3 bg-card rounded border border-primary">
                      <p className="text-sm text-muted-foreground">Recommended Pipe Diameter</p>
                      <p className="text-2xl font-bold text-primary">{results.recommendedDiameter} inches</p>
                    </div>
                    <div className="p-3 bg-card rounded border border-border">
                      <p className="text-sm text-muted-foreground">Maximum Homes for This Size</p>
                      <p className="text-2xl font-bold">{results.maxHomes}</p>
                    </div>
                    <div className="p-3 bg-card rounded border border-border">
                      <p className="text-sm text-muted-foreground">Friction Loss</p>
                      <p className="text-2xl font-bold">{results.frictionLoss} ft</p>
                    </div>
                  </div>
                  <Alert>
                    <AlertDescription>
                      Transport velocity: {results.velocity} ft/sec (typical range: 15-18 ft/sec)
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-muted">
            <CardHeader>
              <CardTitle className="text-base">EPA Design Guidelines - Pipe Sizing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-2">Pipe Diameter</th>
                      <th className="text-left p-2">Max Flow (gpm)</th>
                      <th className="text-left p-2">Max Homes</th>
                      <th className="text-left p-2">Typical Use</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="p-2 font-semibold">3 inches</td>
                      <td className="p-2">5-8</td>
                      <td className="p-2">15-20</td>
                      <td className="p-2">Laterals, short branches</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-2 font-semibold">4 inches</td>
                      <td className="p-2">12-16</td>
                      <td className="p-2">40-50</td>
                      <td className="p-2">Sub-mains</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-2 font-semibold">6 inches</td>
                      <td className="p-2">25-35</td>
                      <td className="p-2">80-100</td>
                      <td className="p-2">Main lines</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">8 inches</td>
                      <td className="p-2">50-65</td>
                      <td className="p-2">150-200</td>
                      <td className="p-2">Trunk lines</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pump" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vacuum Station Pump Sizing</CardTitle>
              <CardDescription>Based on EPA Table 3-8: "A" Factor Method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalHomes">Total Homes in System</Label>
                  <Input
                    id="totalHomes"
                    type="number"
                    value={pumpSizing.totalHomes}
                    onChange={(e) => setPumpSizing({...pumpSizing, totalHomes: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avgDailyFlow">Average Daily Flow (gpd)</Label>
                  <Input
                    id="avgDailyFlow"
                    type="number"
                    value={pumpSizing.avgDailyFlow}
                    onChange={(e) => setPumpSizing({...pumpSizing, avgDailyFlow: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vacuumLevel">Design Vacuum Level (in Hg)</Label>
                  <Input
                    id="vacuumLevel"
                    type="number"
                    step="0.5"
                    value={pumpSizing.vacuumLevel}
                    onChange={(e) => setPumpSizing({...pumpSizing, vacuumLevel: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <Button onClick={calculatePumpSize} className="w-full">
                Calculate Pump Requirements
              </Button>

              {results && results.vacuumPumpCFM && (
                <div className="space-y-4 p-4 bg-secondary rounded-lg">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Vacuum Station Sizing Results
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-card rounded border border-border">
                      <p className="text-sm text-muted-foreground">Peak Daily Flow</p>
                      <p className="text-2xl font-bold text-primary">{results.peakFlowGPD} gpd</p>
                    </div>
                    <div className="p-3 bg-card rounded border border-border">
                      <p className="text-sm text-muted-foreground">Peak Flow Rate</p>
                      <p className="text-2xl font-bold text-primary">{results.peakFlowGPM} gpm</p>
                    </div>
                    <div className="p-3 bg-card rounded border border-primary">
                      <p className="text-sm text-muted-foreground">Vacuum Pump Capacity</p>
                      <p className="text-2xl font-bold text-primary">{results.vacuumPumpCFM} CFM</p>
                    </div>
                    <div className="p-3 bg-card rounded border border-border">
                      <p className="text-sm text-muted-foreground">Collection Tank Volume</p>
                      <p className="text-2xl font-bold">{results.tankVolume} cu ft</p>
                    </div>
                    <div className="p-3 bg-card rounded border border-border">
                      <p className="text-sm text-muted-foreground">Discharge Pump Capacity</p>
                      <p className="text-2xl font-bold">{results.dischargePumpGPM} gpm</p>
                    </div>
                    <div className="p-3 bg-card rounded border border-border">
                      <p className="text-sm text-muted-foreground">Discharge Pump HP</p>
                      <p className="text-2xl font-bold">{results.dischargePumpHP} HP</p>
                    </div>
                  </div>
                  <Alert>
                    <AlertDescription>
                      Operating vacuum level: {results.recommendedVacuumLevel} in Hg (recommended range: 16-20 in Hg)
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-muted">
            <CardHeader>
              <CardTitle className="text-base">Design Considerations - Vacuum Station</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-card rounded-lg">
                <h4 className="font-semibold mb-2">Vacuum Pump Selection</h4>
                <ul className="text-sm space-y-1 ml-4 list-disc text-muted-foreground">
                  <li>Liquid ring or rotary vane vacuum pumps recommended</li>
                  <li>Minimum of 2 pumps for redundancy (50-100% capacity each)</li>
                  <li>Operating vacuum: 16-20 inches Hg (54-68 kPa)</li>
                </ul>
              </div>
              <div className="p-3 bg-card rounded-lg">
                <h4 className="font-semibold mb-2">Collection Tank</h4>
                <ul className="text-sm space-y-1 ml-4 list-disc text-muted-foreground">
                  <li>15-minute storage at peak flow minimum</li>
                  <li>Typically 500-2000 gallon capacity</li>
                  <li>Equipped with level sensors and alarms</li>
                </ul>
              </div>
              <div className="p-3 bg-card rounded-lg">
                <h4 className="font-semibold mb-2">Discharge Pumps</h4>
                <ul className="text-sm space-y-1 ml-4 list-disc text-muted-foreground">
                  <li>Minimum of 2 pumps (duplex configuration)</li>
                  <li>Non-clog impellers recommended</li>
                  <li>Variable speed drives for efficiency</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesignCalculator;
