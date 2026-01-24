import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Waves, 
  Wind, 
  AlertTriangle,
  Info,
  Gauge,
  Activity,
  Zap
} from "lucide-react";

const AdvancedHydraulics = () => {
  // Colebrook-White Calculator State
  const [colebrookInputs, setColebrookInputs] = useState({
    diameter: 150, // mm
    velocity: 4.5, // m/s
    roughness: 0.0015, // mm (PVC)
    kinematicViscosity: 1.004e-6, // m²/s (water at 20°C)
    airFraction: 0.5 // Air-to-liquid ratio
  });
  const [colebrookResults, setColebrookResults] = useState<any>(null);

  // Transient Analysis State
  const [transientInputs, setTransientInputs] = useState({
    pipeLength: 500, // m
    diameter: 150, // mm
    waveSpeed: 300, // m/s (reduced for two-phase)
    valveClosureTime: 3, // seconds
    steadyStateVelocity: 4.5, // m/s
    systemPressure: -0.5 // bar (vacuum)
  });
  const [transientResults, setTransientResults] = useState<any>(null);

  // Valve Cycling Logic State
  const [valveCyclingInputs, setValveCyclingInputs] = useState({
    sumpVolume: 40, // liters
    triggerLevel: 10, // liters
    resetLevel: 2, // liters
    inflowRate: 0.05, // L/s per home
    numberOfHomes: 4,
    peakFactor: 3.0,
    valveOpenTime: 4, // seconds
    vacuumLevel: 0.5 // bar
  });
  const [valveCyclingResults, setValveCyclingResults] = useState<any>(null);

  // Calculate friction factor using Colebrook-White (iterative)
  const calculateColebrookWhite = () => {
    const { diameter, velocity, roughness, kinematicViscosity, airFraction } = colebrookInputs;
    const d = diameter / 1000; // Convert to meters
    const k = roughness / 1000; // Convert to meters
    
    // Reynolds number
    const re = (velocity * d) / kinematicViscosity;
    
    // Iterative Colebrook-White solution
    let f = 0.02; // Initial guess
    for (let i = 0; i < 50; i++) {
      const lhs = 1 / Math.sqrt(f);
      const rhs = -2 * Math.log10((k / (3.7 * d)) + (2.51 / (re * Math.sqrt(f))));
      const fNew = 1 / Math.pow(rhs, 2);
      if (Math.abs(fNew - f) < 0.00001) break;
      f = fNew;
    }
    
    // Two-phase flow correction using Lockhart-Martinelli approach
    const X_tt = Math.pow((1 - airFraction) / airFraction, 0.9) * 
                 Math.pow(1.225 / 1000, 0.5) * // density ratio (air/water)
                 Math.pow(1.8e-5 / 1e-3, 0.1); // viscosity ratio
    
    const phi_l = 1 + (20 / X_tt) + (1 / Math.pow(X_tt, 2));
    const twoPhaseMultiplier = Math.sqrt(phi_l);
    
    // Headloss calculation
    const frictionFactor = f * twoPhaseMultiplier;
    const headlossPerMeter = (frictionFactor * Math.pow(velocity, 2)) / (2 * 9.81 * d);
    
    // Flow regime classification
    let flowRegime = 'Slug Flow';
    if (airFraction < 0.3) flowRegime = 'Bubble Flow';
    if (airFraction > 0.7) flowRegime = 'Annular Flow';
    if (velocity > 6) flowRegime = 'Churn Flow';
    
    setColebrookResults({
      reynoldsNumber: Math.round(re),
      baseFrictionFactor: f.toFixed(5),
      twoPhaseMultiplier: twoPhaseMultiplier.toFixed(3),
      effectiveFrictionFactor: frictionFactor.toFixed(5),
      headlossPerMeter: (headlossPerMeter * 1000).toFixed(2), // mm/m
      headlossPer100m: (headlossPerMeter * 100).toFixed(3), // m per 100m
      flowRegime,
      lockhartMartinelliX: X_tt.toFixed(4),
      isTransitional: re > 2300 && re < 4000
    });
  };

  // Calculate transient (water hammer) effects
  const calculateTransient = () => {
    const { pipeLength, diameter, waveSpeed, valveClosureTime, steadyStateVelocity, systemPressure } = transientInputs;
    
    // Critical closure time
    const criticalTime = (2 * pipeLength) / waveSpeed;
    
    // Joukowsky pressure surge
    const densityMixture = 600; // kg/m³ (two-phase estimate)
    const joukowskyPressure = (densityMixture * waveSpeed * steadyStateVelocity) / 100000; // bar
    
    // Actual pressure surge based on closure time
    let actualPressureSurge: number;
    let closureType: string;
    
    if (valveClosureTime < criticalTime) {
      actualPressureSurge = joukowskyPressure;
      closureType = "Rapid (Full Joukowsky)";
    } else {
      actualPressureSurge = joukowskyPressure * (criticalTime / valveClosureTime);
      closureType = "Slow (Reduced Surge)";
    }
    
    // Peak pressure (absolute)
    const atmosphericPressure = 1.0; // bar
    const peakPressure = atmosphericPressure + systemPressure + actualPressureSurge;
    const minPressure = atmosphericPressure + systemPressure - actualPressureSurge;
    
    // Vacuum break risk
    const vacuumBreakRisk = minPressure < 0.1 ? "HIGH" : minPressure < 0.3 ? "MEDIUM" : "LOW";
    
    // Recommended actions
    const recommendations: string[] = [];
    if (actualPressureSurge > 2) recommendations.push("Install surge anticipator valves");
    if (vacuumBreakRisk === "HIGH") recommendations.push("Add vacuum breakers at high points");
    if (valveClosureTime < criticalTime) recommendations.push("Slow valve closure rate");
    
    setTransientResults({
      criticalTime: criticalTime.toFixed(2),
      joukowskyPressure: joukowskyPressure.toFixed(3),
      actualPressureSurge: actualPressureSurge.toFixed(3),
      closureType,
      peakPressure: peakPressure.toFixed(3),
      minPressure: minPressure.toFixed(3),
      vacuumBreakRisk,
      waveReflectionTime: (criticalTime * 1000).toFixed(0), // ms
      recommendations
    });
  };

  // Calculate valve cycling behavior
  const calculateValveCycling = () => {
    const { 
      sumpVolume, triggerLevel, resetLevel, inflowRate, 
      numberOfHomes, peakFactor, valveOpenTime, vacuumLevel 
    } = valveCyclingInputs;
    
    // Flow calculations
    const averageInflow = inflowRate * numberOfHomes; // L/s
    const peakInflow = averageInflow * peakFactor; // L/s
    
    // Fill time calculation
    const fillVolume = triggerLevel - resetLevel; // liters
    const avgFillTime = fillVolume / averageInflow; // seconds
    const peakFillTime = fillVolume / peakInflow; // seconds
    
    // Cycle frequency
    const avgCyclesPerHour = 3600 / (avgFillTime + valveOpenTime);
    const peakCyclesPerHour = 3600 / (peakFillTime + valveOpenTime);
    
    // Discharge volume per cycle
    const dischargeVolume = triggerLevel; // liters
    
    // Valve duty cycle
    const avgDutyCycle = (valveOpenTime / (avgFillTime + valveOpenTime)) * 100;
    
    // Air admission estimate (20 CFM = 9.44 L/s during valve open)
    const airAdmissionRate = 9.44; // L/s (20 CFM)
    const airPerCycle = airAdmissionRate * valveOpenTime;
    const airToLiquidRatio = airPerCycle / dischargeVolume;
    
    // Vacuum head requirement
    const staticLift = 1.5; // m (typical sump depth)
    const frictionAllowance = 0.5; // m (local losses)
    const minVacuumRequired = (staticLift + frictionAllowance) / 10.33; // bar
    
    // System capacity check
    const maxHomesSupported = Math.floor((avgCyclesPerHour * dischargeVolume) / (inflowRate * 3600));
    
    // Warnings
    const warnings: string[] = [];
    if (peakCyclesPerHour > 60) warnings.push("Peak cycling exceeds 60/hr - valve wear risk");
    if (avgDutyCycle > 25) warnings.push("High duty cycle - consider larger sump");
    if (vacuumLevel < minVacuumRequired) warnings.push("Vacuum level may be insufficient for sump depth");
    if (airToLiquidRatio < 1.5 || airToLiquidRatio > 4) warnings.push("A/L ratio outside optimal range (1.5-4)");
    
    setValveCyclingResults({
      avgFillTime: avgFillTime.toFixed(1),
      peakFillTime: peakFillTime.toFixed(1),
      avgCyclesPerHour: avgCyclesPerHour.toFixed(1),
      peakCyclesPerHour: peakCyclesPerHour.toFixed(1),
      dischargeVolume: dischargeVolume.toFixed(1),
      avgDutyCycle: avgDutyCycle.toFixed(1),
      airToLiquidRatio: airToLiquidRatio.toFixed(2),
      minVacuumRequired: minVacuumRequired.toFixed(3),
      maxHomesSupported,
      dailyCycles: Math.round(avgCyclesPerHour * 24),
      annualCycles: Math.round(avgCyclesPerHour * 24 * 365),
      warnings
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Advanced Hydraulics Calculator</CardTitle>
              <CardDescription>
                Colebrook-White friction, transient analysis, and valve cycling logic for vacuum sewers
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          These advanced calculations address the nuanced engineering requirements for vacuum sewer design, 
          including two-phase flow friction, water hammer effects, and pneumatic valve behavior.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="colebrook" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="colebrook" className="gap-2">
            <Waves className="h-4 w-4" />
            Colebrook-White
          </TabsTrigger>
          <TabsTrigger value="transient" className="gap-2">
            <Zap className="h-4 w-4" />
            Transient Analysis
          </TabsTrigger>
          <TabsTrigger value="valve" className="gap-2">
            <Gauge className="h-4 w-4" />
            Valve Cycling
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colebrook" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Two-Phase Colebrook-White Friction Calculator</CardTitle>
              <CardDescription>
                Calculates friction factor for air/water mixtures using Lockhart-Martinelli correlation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Pipe Diameter (mm)</Label>
                  <Input
                    type="number"
                    value={colebrookInputs.diameter}
                    onChange={e => setColebrookInputs({...colebrookInputs, diameter: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mixture Velocity (m/s)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={colebrookInputs.velocity}
                    onChange={e => setColebrookInputs({...colebrookInputs, velocity: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pipe Roughness (mm)</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={colebrookInputs.roughness}
                    onChange={e => setColebrookInputs({...colebrookInputs, roughness: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Air Fraction (0-1)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={colebrookInputs.airFraction}
                    onChange={e => setColebrookInputs({...colebrookInputs, airFraction: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kinematic Viscosity (m²/s)</Label>
                  <Input
                    type="text"
                    value={colebrookInputs.kinematicViscosity}
                    onChange={e => setColebrookInputs({...colebrookInputs, kinematicViscosity: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <Button onClick={calculateColebrookWhite} className="w-full">
                Calculate Friction Factors
              </Button>

              {colebrookResults && (
                <div className="space-y-4 mt-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-secondary rounded-lg text-center">
                      <p className="text-2xl font-bold text-primary">{colebrookResults.reynoldsNumber.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Reynolds Number</p>
                      {colebrookResults.isTransitional && (
                        <Badge variant="outline" className="mt-1">Transitional</Badge>
                      )}
                    </div>
                    <div className="p-4 bg-secondary rounded-lg text-center">
                      <p className="text-2xl font-bold text-primary">{colebrookResults.baseFrictionFactor}</p>
                      <p className="text-xs text-muted-foreground">Base Friction Factor (f)</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg text-center">
                      <p className="text-2xl font-bold text-orange-500">{colebrookResults.twoPhaseMultiplier}</p>
                      <p className="text-xs text-muted-foreground">Two-Phase Multiplier (φ)</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Effective Friction Factor</h4>
                      <p className="text-xl font-bold">{colebrookResults.effectiveFrictionFactor}</p>
                      <p className="text-sm text-muted-foreground">
                        Headloss: {colebrookResults.headlossPerMeter} mm/m ({colebrookResults.headlossPer100m} m per 100m)
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Flow Regime</h4>
                      <Badge className="text-lg px-3 py-1">{colebrookResults.flowRegime}</Badge>
                      <p className="text-sm text-muted-foreground mt-2">
                        Lockhart-Martinelli X = {colebrookResults.lockhartMartinelliX}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reference: Flow Regimes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-3">
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                  <h4 className="font-semibold text-blue-600">Bubble Flow</h4>
                  <p className="text-xs text-muted-foreground">Air fraction &lt; 30%</p>
                </div>
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                  <h4 className="font-semibold text-green-600">Slug Flow</h4>
                  <p className="text-xs text-muted-foreground">Typical vacuum operation</p>
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                  <h4 className="font-semibold text-yellow-600">Churn Flow</h4>
                  <p className="text-xs text-muted-foreground">High velocity (&gt;6 m/s)</p>
                </div>
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded">
                  <h4 className="font-semibold text-red-600">Annular Flow</h4>
                  <p className="text-xs text-muted-foreground">Air fraction &gt; 70%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transient" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Transient (Water Hammer) Analysis
              </CardTitle>
              <CardDescription>
                Calculate pressure surges from valve operations in vacuum systems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Two-phase flow has significantly lower wave speeds than pure water, reducing 
                  but not eliminating transient risks. Vacuum systems are particularly sensitive 
                  to pressure oscillations that can break vacuum.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Pipe Length (m)</Label>
                  <Input
                    type="number"
                    value={transientInputs.pipeLength}
                    onChange={e => setTransientInputs({...transientInputs, pipeLength: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pipe Diameter (mm)</Label>
                  <Input
                    type="number"
                    value={transientInputs.diameter}
                    onChange={e => setTransientInputs({...transientInputs, diameter: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Wave Speed (m/s)</Label>
                  <Input
                    type="number"
                    value={transientInputs.waveSpeed}
                    onChange={e => setTransientInputs({...transientInputs, waveSpeed: parseFloat(e.target.value)})}
                  />
                  <p className="text-xs text-muted-foreground">Typical: 200-400 m/s for two-phase</p>
                </div>
                <div className="space-y-2">
                  <Label>Valve Closure Time (s)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={transientInputs.valveClosureTime}
                    onChange={e => setTransientInputs({...transientInputs, valveClosureTime: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Steady-State Velocity (m/s)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={transientInputs.steadyStateVelocity}
                    onChange={e => setTransientInputs({...transientInputs, steadyStateVelocity: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>System Pressure (bar, gauge)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={transientInputs.systemPressure}
                    onChange={e => setTransientInputs({...transientInputs, systemPressure: parseFloat(e.target.value)})}
                  />
                  <p className="text-xs text-muted-foreground">Negative for vacuum</p>
                </div>
              </div>

              <Button onClick={calculateTransient} className="w-full">
                Analyze Transients
              </Button>

              {transientResults && (
                <div className="space-y-4 mt-4">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="p-4 bg-secondary rounded-lg text-center">
                      <p className="text-xl font-bold text-primary">{transientResults.criticalTime} s</p>
                      <p className="text-xs text-muted-foreground">Critical Closure Time</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg text-center">
                      <p className="text-xl font-bold text-orange-500">{transientResults.joukowskyPressure} bar</p>
                      <p className="text-xs text-muted-foreground">Max Joukowsky Surge</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg text-center">
                      <p className="text-xl font-bold text-primary">{transientResults.actualPressureSurge} bar</p>
                      <p className="text-xs text-muted-foreground">Actual Surge</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg text-center">
                      <Badge variant={transientResults.closureType.includes("Rapid") ? "destructive" : "secondary"}>
                        {transientResults.closureType}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold">Peak Pressure</h4>
                      <p className="text-xl font-bold">{transientResults.peakPressure} bar abs</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold">Minimum Pressure</h4>
                      <p className="text-xl font-bold">{transientResults.minPressure} bar abs</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold">Vacuum Break Risk</h4>
                      <Badge variant={
                        transientResults.vacuumBreakRisk === "HIGH" ? "destructive" :
                        transientResults.vacuumBreakRisk === "MEDIUM" ? "outline" : "secondary"
                      }>
                        {transientResults.vacuumBreakRisk}
                      </Badge>
                    </div>
                  </div>

                  {transientResults.recommendations.length > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Recommendations:</strong>
                        <ul className="list-disc ml-4 mt-2">
                          {transientResults.recommendations.map((rec: string, idx: number) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="valve" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Valve Cycling Logic Calculator
              </CardTitle>
              <CardDescription>
                Analyze pneumatic valve behavior, cycle frequency, and air-liquid ratios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Sump Volume (L)</Label>
                  <Input
                    type="number"
                    value={valveCyclingInputs.sumpVolume}
                    onChange={e => setValveCyclingInputs({...valveCyclingInputs, sumpVolume: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Trigger Level (L)</Label>
                  <Input
                    type="number"
                    value={valveCyclingInputs.triggerLevel}
                    onChange={e => setValveCyclingInputs({...valveCyclingInputs, triggerLevel: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reset Level (L)</Label>
                  <Input
                    type="number"
                    value={valveCyclingInputs.resetLevel}
                    onChange={e => setValveCyclingInputs({...valveCyclingInputs, resetLevel: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Number of Homes</Label>
                  <Input
                    type="number"
                    value={valveCyclingInputs.numberOfHomes}
                    onChange={e => setValveCyclingInputs({...valveCyclingInputs, numberOfHomes: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Inflow per Home (L/s)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valveCyclingInputs.inflowRate}
                    onChange={e => setValveCyclingInputs({...valveCyclingInputs, inflowRate: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Peak Factor</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={valveCyclingInputs.peakFactor}
                    onChange={e => setValveCyclingInputs({...valveCyclingInputs, peakFactor: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valve Open Time (s)</Label>
                  <Input
                    type="number"
                    value={valveCyclingInputs.valveOpenTime}
                    onChange={e => setValveCyclingInputs({...valveCyclingInputs, valveOpenTime: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vacuum Level (bar)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={valveCyclingInputs.vacuumLevel}
                    onChange={e => setValveCyclingInputs({...valveCyclingInputs, vacuumLevel: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <Button onClick={calculateValveCycling} className="w-full">
                Analyze Valve Cycling
              </Button>

              {valveCyclingResults && (
                <div className="space-y-4 mt-4">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="p-4 bg-secondary rounded-lg text-center">
                      <p className="text-xl font-bold text-primary">{valveCyclingResults.avgCyclesPerHour}</p>
                      <p className="text-xs text-muted-foreground">Avg Cycles/Hour</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg text-center">
                      <p className="text-xl font-bold text-orange-500">{valveCyclingResults.peakCyclesPerHour}</p>
                      <p className="text-xs text-muted-foreground">Peak Cycles/Hour</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg text-center">
                      <p className="text-xl font-bold text-primary">{valveCyclingResults.avgDutyCycle}%</p>
                      <p className="text-xs text-muted-foreground">Duty Cycle</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg text-center">
                      <p className="text-xl font-bold text-green-500">{valveCyclingResults.airToLiquidRatio}</p>
                      <p className="text-xs text-muted-foreground">Air/Liquid Ratio</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold">Fill Times</h4>
                      <p>Average: {valveCyclingResults.avgFillTime}s</p>
                      <p>Peak: {valveCyclingResults.peakFillTime}s</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold">Cycle Count</h4>
                      <p>Daily: {valveCyclingResults.dailyCycles}</p>
                      <p>Annual: {valveCyclingResults.annualCycles.toLocaleString()}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold">Capacity</h4>
                      <p>Volume/Cycle: {valveCyclingResults.dischargeVolume}L</p>
                      <p>Max Homes: {valveCyclingResults.maxHomesSupported}</p>
                    </div>
                  </div>

                  {valveCyclingResults.warnings.length > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Warnings:</strong>
                        <ul className="list-disc ml-4 mt-2">
                          {valveCyclingResults.warnings.map((warning: string, idx: number) => (
                            <li key={idx}>{warning}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedHydraulics;
