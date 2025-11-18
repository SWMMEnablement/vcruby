import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CostEstimator = () => {
  const [params, setParams] = useState({
    numHomes: 75,
    mainLength: 5000, // feet
    serviceLength: 150, // feet per home
    valvePits: 25,
  });

  const [costs, setCosts] = useState<any>(null);

  const calculateCosts = () => {
    // Unit costs based on EPA Table 3-25 (mid-1990 dollars, adjusted)
    const inflation = 2.1; // Approximate inflation multiplier from 1990 to 2024
    
    // Mains costs (per linear foot)
    const pipe3in = 45 * inflation;
    const pipe4in = 50 * inflation;
    const pipe6in = 65 * inflation;
    const pipe8in = 85 * inflation;
    
    // Determine main pipe size based on homes
    let mainPipeSize = "4 inch";
    let mainUnitCost = pipe4in;
    if (params.numHomes <= 20) {
      mainPipeSize = "3 inch";
      mainUnitCost = pipe3in;
    } else if (params.numHomes <= 50) {
      mainPipeSize = "4 inch";
      mainUnitCost = pipe4in;
    } else if (params.numHomes <= 100) {
      mainPipeSize = "6 inch";
      mainUnitCost = pipe6in;
    } else {
      mainPipeSize = "8 inch";
      mainUnitCost = pipe8in;
    }
    
    const mainsCost = params.mainLength * mainUnitCost;
    
    // Service lines (4-inch gravity)
    const serviceCost = params.numHomes * params.serviceLength * (35 * inflation);
    
    // Valve pits (per pit, from EPA Table 3-26)
    const valvePitCost = params.valvePits * (3500 * inflation);
    
    // Vacuum station (from EPA Table 3-27, based on system size)
    let stationCost = 0;
    if (params.numHomes <= 50) {
      stationCost = 85000 * inflation;
    } else if (params.numHomes <= 100) {
      stationCost = 125000 * inflation;
    } else if (params.numHomes <= 200) {
      stationCost = 175000 * inflation;
    } else {
      stationCost = 250000 * inflation;
    }
    
    // Engineering & contingencies (15-20% of construction)
    const constructionSubtotal = mainsCost + serviceCost + valvePitCost + stationCost;
    const engineeringCost = constructionSubtotal * 0.18;
    
    const totalCost = constructionSubtotal + engineeringCost;
    const costPerHome = totalCost / params.numHomes;
    
    // O&M costs (annual, from EPA)
    const powerCost = params.numHomes * (45 * inflation); // Per home per year
    const maintenanceCost = params.valvePits * (150 * inflation); // Per valve pit per year
    const laborCost = 35000 * inflation; // Base operator salary
    const annualOM = powerCost + maintenanceCost + laborCost;
    
    setCosts({
      mainsCost: mainsCost.toFixed(0),
      serviceCost: serviceCost.toFixed(0),
      valvePitCost: valvePitCost.toFixed(0),
      stationCost: stationCost.toFixed(0),
      engineeringCost: engineeringCost.toFixed(0),
      totalCost: totalCost.toFixed(0),
      costPerHome: costPerHome.toFixed(0),
      annualOM: annualOM.toFixed(0),
      mainPipeSize,
      inflation: inflation.toFixed(1),
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-engineering-blue" />
            Cost Analysis Tool
          </CardTitle>
          <CardDescription>Chapter 3.8 - System Costs (2024 Estimates)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertDescription>
              Cost estimates are based on EPA mid-1990 unit costs adjusted for inflation. Actual costs vary by
              location, site conditions, and local market rates.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-4">
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
              <Label htmlFor="mainLength">Main Line Length (feet)</Label>
              <Input
                id="mainLength"
                type="number"
                value={params.mainLength}
                onChange={(e) => setParams({...params, mainLength: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceLength">Avg Service Line Length (feet/home)</Label>
              <Input
                id="serviceLength"
                type="number"
                value={params.serviceLength}
                onChange={(e) => setParams({...params, serviceLength: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valvePits">Number of Valve Pits</Label>
              <Input
                id="valvePits"
                type="number"
                value={params.valvePits}
                onChange={(e) => setParams({...params, valvePits: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <Button onClick={calculateCosts} className="w-full">
            Calculate System Costs
          </Button>

          {costs && (
            <div className="space-y-6">
              <div className="p-4 bg-secondary rounded-lg">
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Capital Cost Breakdown
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-card rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Vacuum Mains ({costs.mainPipeSize})</p>
                    <p className="text-2xl font-bold">${parseInt(costs.mainsCost).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-card rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Service Lines (4" gravity)</p>
                    <p className="text-2xl font-bold">${parseInt(costs.serviceCost).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-card rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Valve Pits & Valves</p>
                    <p className="text-2xl font-bold">${parseInt(costs.valvePitCost).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-card rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Vacuum Station</p>
                    <p className="text-2xl font-bold">${parseInt(costs.stationCost).toLocaleString()}</p>
                  </div>
                </div>

                <div className="p-4 bg-card rounded-lg border border-border mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Engineering & Contingencies (18%)</p>
                  <p className="text-2xl font-bold">${parseInt(costs.engineeringCost).toLocaleString()}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
                    <p className="text-sm text-muted-foreground mb-1">Total Capital Cost</p>
                    <p className="text-3xl font-bold text-primary">${parseInt(costs.totalCost).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-lg border-2 border-accent">
                    <p className="text-sm text-muted-foreground mb-1">Cost Per Home</p>
                    <p className="text-3xl font-bold text-accent">${parseInt(costs.costPerHome).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Annual O&M Costs</h3>
                <div className="p-4 bg-card rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Estimated Annual Operating & Maintenance</p>
                  <p className="text-2xl font-bold text-engineering-teal">${parseInt(costs.annualOM).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Includes power (~${(parseInt(costs.annualOM) * 0.4).toFixed(0)}), 
                    maintenance (~${(parseInt(costs.annualOM) * 0.3).toFixed(0)}), 
                    and labor (~${(parseInt(costs.annualOM) * 0.3).toFixed(0)})
                  </p>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Note:</strong> Costs adjusted by {costs.inflation}x inflation factor from 1990 baseline.
                  Regional variations can be ±30%. Site-specific factors (soil, rock, water table) significantly impact costs.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle className="text-base">EPA Unit Cost Reference (2024 Adjusted)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-sm">Vacuum Mains (per linear foot, installed)</h4>
              <div className="grid md:grid-cols-4 gap-2">
                <Badge variant="outline" className="justify-center py-2">3": $95</Badge>
                <Badge variant="outline" className="justify-center py-2">4": $105</Badge>
                <Badge variant="outline" className="justify-center py-2">6": $137</Badge>
                <Badge variant="outline" className="justify-center py-2">8": $179</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm">Service Lines (4" gravity, per LF)</h4>
              <Badge variant="outline" className="py-2">$74 per foot</Badge>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm">Valve Pits</h4>
              <div className="grid md:grid-cols-2 gap-2">
                <Badge variant="outline" className="justify-center py-2">Standard Fiberglass: $7,350</Badge>
                <Badge variant="outline" className="justify-center py-2">Deep/Special: $10,500+</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm">Vacuum Stations (complete, by capacity)</h4>
              <div className="grid md:grid-cols-2 gap-2">
                <div className="p-2 border border-border rounded text-sm">
                  <p className="font-semibold">≤50 homes</p>
                  <p className="text-muted-foreground">~$179,000</p>
                </div>
                <div className="p-2 border border-border rounded text-sm">
                  <p className="font-semibold">50-100 homes</p>
                  <p className="text-muted-foreground">~$263,000</p>
                </div>
                <div className="p-2 border border-border rounded text-sm">
                  <p className="font-semibold">100-200 homes</p>
                  <p className="text-muted-foreground">~$368,000</p>
                </div>
                <div className="p-2 border border-border rounded text-sm">
                  <p className="font-semibold">{'>'}200 homes</p>
                  <p className="text-muted-foreground">~$525,000+</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cost Comparison with Alternatives</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Vacuum sewers are typically cost-competitive when compared to conventional gravity systems in:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span><strong>Flat terrain:</strong> Eliminates need for multiple lift stations ($150,000+ each)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span><strong>High water table:</strong> Reduces excavation depth from 8-12 ft to 3-4 ft</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span><strong>Rocky soil:</strong> Shallow trenching reduces blasting and excavation costs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span><strong>Low density:</strong> Main lines can follow property lines, reducing length</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span><strong>Retrofit:</strong> Less disruption to existing infrastructure</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostEstimator;
