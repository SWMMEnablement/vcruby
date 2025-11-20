import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, ArrowDown, ArrowUp, Droplet, Wind } from "lucide-react";

export const TechnicalDiagrams = () => {
  const [activeTab, setActiveTab] = useState("sawtooth");

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Technical diagrams illustrating key vacuum sewer system components and flow dynamics. 
          These visualizations help understand the physical principles behind vacuum transport.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sawtooth">Sawtooth Profile</TabsTrigger>
          <TabsTrigger value="valvepit">Valve Pit</TabsTrigger>
          <TabsTrigger value="slugflow">Slug Flow</TabsTrigger>
        </TabsList>

        {/* Sawtooth Profile Diagram */}
        <TabsContent value="sawtooth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sawtooth Profile Configuration</CardTitle>
              <CardDescription>
                Characteristic vertical alignment of vacuum mains with alternating runs and lifts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-b from-sky-100 to-background p-8 rounded-lg border">
                <svg viewBox="0 0 800 300" className="w-full h-auto">
                  {/* Ground line */}
                  <line x1="0" y1="150" x2="800" y2="150" stroke="currentColor" strokeWidth="1" strokeDasharray="4" opacity="0.3" />
                  <text x="10" y="145" fontSize="10" fill="currentColor" opacity="0.5">Ground Level</text>
                  
                  {/* Sawtooth pattern */}
                  <path
                    d="M 50,200 L 200,220 L 250,150 L 400,170 L 450,100 L 600,120 L 650,70 L 750,85"
                    fill="none"
                    stroke="hsl(var(--engineering-blue))"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Direction arrow */}
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                      <polygon points="0 0, 10 3, 0 6" fill="hsl(var(--engineering-blue))" />
                    </marker>
                  </defs>
                  <line x1="750" y1="85" x2="780" y2="82" stroke="hsl(var(--engineering-blue))" strokeWidth="3" markerEnd="url(#arrowhead)" />
                  <text x="720" y="60" fontSize="12" fontWeight="bold" fill="hsl(var(--engineering-blue))">Flow to Vacuum Station</text>

                  {/* Run sections - downward slopes */}
                  <g opacity="0.8">
                    {/* Run 1 */}
                    <line x1="50" y1="200" x2="200" y2="220" stroke="currentColor" strokeWidth="2" strokeDasharray="3" />
                    <text x="100" y="240" fontSize="11" fill="currentColor" textAnchor="middle">Run (Gravity)</text>
                    <text x="100" y="252" fontSize="9" fill="currentColor" opacity="0.7" textAnchor="middle">0.2% slope</text>
                    
                    {/* Run 2 */}
                    <line x1="250" y1="150" x2="400" y2="170" stroke="currentColor" strokeWidth="2" strokeDasharray="3" />
                    <text x="325" y="190" fontSize="11" fill="currentColor" textAnchor="middle">Run</text>
                    
                    {/* Run 3 */}
                    <line x1="450" y1="100" x2="600" y2="120" stroke="currentColor" strokeWidth="2" strokeDasharray="3" />
                    <text x="525" y="140" fontSize="11" fill="currentColor" textAnchor="middle">Run</text>
                  </g>

                  {/* Lift sections - upward slopes */}
                  <g>
                    {/* Lift 1 */}
                    <line x1="200" y1="220" x2="250" y2="150" stroke="hsl(var(--destructive))" strokeWidth="3" />
                    <text x="225" y="175" fontSize="11" fontWeight="bold" fill="hsl(var(--destructive))" textAnchor="middle">Lift</text>
                    <text x="225" y="187" fontSize="9" fill="hsl(var(--destructive))" textAnchor="middle">45°</text>
                    <ArrowUp className="text-destructive" style={{ position: 'absolute', width: '16px', height: '16px' }} />
                    
                    {/* Lift 2 */}
                    <line x1="400" y1="170" x2="450" y2="100" stroke="hsl(var(--destructive))" strokeWidth="3" />
                    <text x="425" y="125" fontSize="11" fontWeight="bold" fill="hsl(var(--destructive))" textAnchor="middle">Lift</text>
                    
                    {/* Lift 3 */}
                    <line x1="600" y1="120" x2="650" y2="70" stroke="hsl(var(--destructive))" strokeWidth="3" />
                    <text x="625" y="85" fontSize="11" fontWeight="bold" fill="hsl(var(--destructive))" textAnchor="middle">Lift</text>
                  </g>

                  {/* Liquid accumulation points */}
                  <circle cx="200" cy="220" r="8" fill="hsl(var(--primary))" opacity="0.6" />
                  <circle cx="400" cy="170" r="8" fill="hsl(var(--primary))" opacity="0.6" />
                  <circle cx="600" cy="120" r="8" fill="hsl(var(--primary))" opacity="0.6" />
                  
                  {/* Labels for accumulation */}
                  <text x="200" y="245" fontSize="9" fill="hsl(var(--primary))" textAnchor="middle">Liquid Seal</text>
                </svg>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-secondary rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                    Run Sections
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Typically 0.2% downward slope</li>
                    <li>• 30-100 meters long</li>
                    <li>• Gravity assists flow</li>
                    <li>• Prevents solid accumulation</li>
                  </ul>
                </div>

                <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <ArrowUp className="h-4 w-4 text-destructive" />
                    Lift Sections
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 45° upward angle</li>
                    <li>• 0.5-2 meters vertical rise</li>
                    <li>• Creates hydraulic seals</li>
                    <li>• High energy consumption point</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Valve Pit Diagram */}
        <TabsContent value="valvepit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vacuum Valve Pit Cross-Section</CardTitle>
              <CardDescription>
                Interface between atmospheric pressure and vacuum system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-b from-amber-50 to-background p-8 rounded-lg border">
                <svg viewBox="0 0 600 500" className="w-full h-auto">
                  {/* Ground level */}
                  <rect x="0" y="150" width="600" height="10" fill="hsl(var(--muted))" />
                  <text x="10" y="145" fontSize="12" fontWeight="bold" fill="currentColor">Ground Level</text>
                  
                  {/* House connection */}
                  <rect x="50" y="100" width="120" height="50" fill="hsl(var(--secondary))" stroke="currentColor" strokeWidth="2" />
                  <text x="110" y="130" fontSize="11" fontWeight="bold" fill="currentColor" textAnchor="middle">House</text>
                  
                  {/* Gravity pipe from house */}
                  <rect x="140" y="145" width="60" height="8" fill="hsl(var(--muted-foreground))" />
                  <text x="170" y="142" fontSize="9" fill="currentColor" textAnchor="middle">Gravity Pipe</text>
                  
                  {/* Valve pit chamber */}
                  <rect x="180" y="160" width="140" height="260" fill="hsl(var(--card))" stroke="currentColor" strokeWidth="3" rx="5" />
                  
                  {/* Sump (bottom portion) */}
                  <rect x="195" y="300" width="110" height="110" fill="hsl(var(--primary))" opacity="0.3" stroke="hsl(var(--primary))" strokeWidth="2" />
                  <text x="250" y="360" fontSize="11" fontWeight="bold" fill="hsl(var(--primary))" textAnchor="middle">Sump</text>
                  <text x="250" y="375" fontSize="9" fill="hsl(var(--primary))" textAnchor="middle">40-115 L</text>
                  
                  {/* Liquid level indicators */}
                  <line x1="190" y1="320" x2="310" y2="320" stroke="hsl(var(--destructive))" strokeWidth="2" strokeDasharray="4" />
                  <text x="315" y="323" fontSize="9" fill="hsl(var(--destructive))">High Level (ON)</text>
                  <circle cx="185" cy="320" r="4" fill="hsl(var(--destructive))" />
                  
                  <line x1="190" y1="390" x2="310" y2="390" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4" />
                  <text x="315" y="393" fontSize="9" fill="hsl(var(--primary))">Low Level (OFF)</text>
                  <circle cx="185" cy="390" r="4" fill="hsl(var(--primary))" />
                  
                  {/* Simulated liquid */}
                  <rect x="195" y="340" width="110" height="70" fill="hsl(var(--primary))" opacity="0.5" />
                  
                  {/* Valve assembly */}
                  <rect x="230" y="200" width="40" height="60" fill="hsl(var(--engineering-blue))" stroke="currentColor" strokeWidth="2" rx="3" />
                  <text x="250" y="235" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">3" Valve</text>
                  
                  {/* Valve connection to sump */}
                  <line x1="250" y1="260" x2="250" y2="300" stroke="currentColor" strokeWidth="2" />
                  <text x="258" y="280" fontSize="9" fill="currentColor">Sensor</text>
                  
                  {/* Inlet pipe from gravity */}
                  <line x1="200" y1="154" x2="220" y2="300" stroke="hsl(var(--muted-foreground))" strokeWidth="6" />
                  <text x="205" y="220" fontSize="9" fill="currentColor" transform="rotate(-70 205 220)">Inlet</text>
                  
                  {/* Vacuum main connection */}
                  <rect x="320" y="235" width="100" height="10" fill="hsl(var(--engineering-blue))" />
                  <text x="370" y="232" fontSize="10" fontWeight="bold" fill="hsl(var(--engineering-blue))" textAnchor="middle">To Vacuum Main</text>
                  
                  {/* Vacuum main pipe extending right */}
                  <rect x="420" y="235" width="150" height="10" fill="hsl(var(--engineering-blue))" opacity="0.7" />
                  <text x="495" y="260" fontSize="9" fill="hsl(var(--engineering-blue))" textAnchor="middle">Vacuum @ -0.6 bar</text>
                  
                  {/* Controller box */}
                  <rect x="195" y="170" width="50" height="40" fill="hsl(var(--muted))" stroke="currentColor" strokeWidth="2" rx="3" />
                  <text x="220" y="193" fontSize="9" fontWeight="bold" fill="currentColor" textAnchor="middle">Pneumatic</text>
                  <text x="220" y="203" fontSize="9" fontWeight="bold" fill="currentColor" textAnchor="middle">Controller</text>
                  
                  {/* Control line */}
                  <line x1="220" y1="210" x2="230" y2="220" stroke="currentColor" strokeWidth="1" strokeDasharray="2" />
                  
                  {/* Labels */}
                  <text x="250" y="440" fontSize="11" fontWeight="bold" fill="currentColor" textAnchor="middle">Valve Pit</text>
                  <text x="250" y="455" fontSize="9" fill="currentColor" opacity="0.7" textAnchor="middle">(Typical 450mm diameter)</text>
                </svg>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-secondary rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm">Operating Sequence</h4>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Wastewater enters sump via gravity</li>
                    <li>Level rises to high setpoint</li>
                    <li>Pneumatic controller opens valve</li>
                    <li>Pressure differential pulls liquid</li>
                    <li>Valve stays open 4-6s for air</li>
                    <li>Valve closes at low level</li>
                  </ol>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <h4 className="font-semibold mb-2 text-sm">Key Components</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• <strong>Sump:</strong> 40-115 L capacity</li>
                    <li>• <strong>Valve:</strong> 3" (78mm) interface valve</li>
                    <li>• <strong>Controller:</strong> Pneumatic, no power</li>
                    <li>• <strong>Sensor:</strong> Pressure differential</li>
                  </ul>
                </div>

                <div className="p-4 bg-engineering-blue/10 rounded-lg border border-engineering-blue/20">
                  <h4 className="font-semibold mb-2 text-sm">Design Criteria</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Cycle time: 2-4 per hour</li>
                    <li>• Working volume: 20-30 gal</li>
                    <li>• Vacuum: -0.5 to -0.7 bar</li>
                    <li>• Air admission: 4-6 seconds</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Slug Flow Pattern Diagram */}
        <TabsContent value="slugflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Air-Liquid Slug Flow Pattern</CardTitle>
              <CardDescription>
                Two-phase flow dynamics in vacuum mains showing liquid plugs and air pockets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-sky-50 to-background p-8 rounded-lg border">
                <svg viewBox="0 0 800 250" className="w-full h-auto">
                  {/* Pipe outer wall */}
                  <rect x="50" y="80" width="700" height="80" fill="none" stroke="currentColor" strokeWidth="4" rx="8" />
                  
                  {/* Pipe inner area */}
                  <rect x="54" y="84" width="692" height="72" fill="hsl(var(--muted))" opacity="0.2" />
                  
                  {/* Direction of flow arrow */}
                  <defs>
                    <marker id="flowArrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
                      <polygon points="0 0, 12 6, 0 12" fill="hsl(var(--engineering-blue))" />
                    </marker>
                  </defs>
                  <line x1="60" y1="50" x2="140" y2="50" stroke="hsl(var(--engineering-blue))" strokeWidth="3" markerEnd="url(#flowArrow)" />
                  <text x="100" y="40" fontSize="12" fontWeight="bold" fill="hsl(var(--engineering-blue))" textAnchor="middle">Flow Direction</text>
                  
                  {/* Liquid Slug 1 */}
                  <rect x="80" y="90" width="120" height="60" fill="hsl(var(--primary))" opacity="0.7" rx="4" />
                  <text x="140" y="125" fontSize="11" fontWeight="bold" fill="white" textAnchor="middle">Liquid Plug</text>
                  <Droplet className="text-white" style={{ position: 'absolute', width: '16px', height: '16px' }} />
                  
                  {/* Air Pocket 1 */}
                  <ellipse cx="280" cy="120" rx="60" ry="25" fill="hsl(var(--secondary))" opacity="0.7" />
                  <text x="280" y="118" fontSize="10" fontWeight="bold" fill="currentColor" textAnchor="middle">Air</text>
                  <text x="280" y="130" fontSize="8" fill="currentColor" opacity="0.7" textAnchor="middle">Expanding</text>
                  <Wind className="text-muted-foreground" style={{ position: 'absolute', width: '14px', height: '14px' }} />
                  
                  {/* Liquid Slug 2 */}
                  <rect x="360" y="95" width="100" height="50" fill="hsl(var(--primary))" opacity="0.7" rx="4" />
                  <text x="410" y="125" fontSize="11" fontWeight="bold" fill="white" textAnchor="middle">Liquid</text>
                  
                  {/* Air Pocket 2 */}
                  <ellipse cx="530" cy="120" rx="50" ry="22" fill="hsl(var(--secondary))" opacity="0.7" />
                  <text x="530" y="123" fontSize="10" fontWeight="bold" fill="currentColor" textAnchor="middle">Air</text>
                  
                  {/* Liquid Slug 3 */}
                  <rect x="600" y="92" width="130" height="56" fill="hsl(var(--primary))" opacity="0.7" rx="4" />
                  <text x="665" y="125" fontSize="11" fontWeight="bold" fill="white" textAnchor="middle">Liquid Plug</text>
                  
                  {/* Velocity annotations */}
                  <g opacity="0.8">
                    {/* Liquid velocity */}
                    <line x1="140" y1="170" x2="170" y2="170" stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#flowArrow)" />
                    <text x="155" y="185" fontSize="9" fill="hsl(var(--primary))" textAnchor="middle">v_liquid ≈ 0.8-1.5 m/s</text>
                    
                    {/* Air velocity */}
                    <line x1="280" y1="170" x2="330" y2="170" stroke="hsl(var(--engineering-blue))" strokeWidth="2" markerEnd="url(#flowArrow)" />
                    <text x="305" y="185" fontSize="9" fill="hsl(var(--engineering-blue))" textAnchor="middle">v_air ≈ 5-15 m/s</text>
                  </g>
                  
                  {/* Labels */}
                  <text x="400" y="210" fontSize="12" fontWeight="bold" fill="currentColor" textAnchor="middle">Vacuum Main (Typical 110-160mm diameter)</text>
                  <text x="400" y="225" fontSize="10" fill="currentColor" opacity="0.7" textAnchor="middle">Pressure gradient: Atmospheric → -0.6 bar (Vacuum Station)</text>
                </svg>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Droplet className="h-4 w-4 text-primary" />
                      Liquid Phase Characteristics
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Forms discrete "plugs" or "slugs"</li>
                      <li>• Velocity: 0.8-1.5 m/s (relatively slow)</li>
                      <li>• Contains wastewater and solids</li>
                      <li>• Occupies 20-40% of pipe cross-section</li>
                      <li>• Transported by expanding air behind it</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-secondary rounded-lg">
                    <h4 className="font-semibold mb-2">A/L Ratio (Air-to-Liquid)</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Typical Range:</span>
                        <Badge>2:1 to 15:1</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Optimal Design:</span>
                        <Badge variant="outline">4:1 to 6:1</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground pt-2">
                        Higher ratios mean more air admission per valve cycle, providing more transport energy but consuming more vacuum capacity.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-engineering-blue/10 rounded-lg border border-engineering-blue/20">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Wind className="h-4 w-4 text-engineering-blue" />
                      Air Phase Characteristics
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• High velocity: 5-15 m/s (supersonic possible)</li>
                      <li>• Expands as pressure drops toward station</li>
                      <li>• Occupies 60-80% of pipe volume</li>
                      <li>• Provides kinetic energy for transport</li>
                      <li>• Causes interfacial shear and turbulence</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <h4 className="font-semibold mb-2">Two-Phase Flow Effects</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <strong>Slip:</strong> Air moves faster than liquid</li>
                      <li>• <strong>Friction:</strong> 2-4× higher than water alone</li>
                      <li>• <strong>Noise:</strong> Turbulent interface creates sound</li>
                      <li>• <strong>Surge:</strong> Rapid pressure changes at lifts</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Alert className="mt-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Modeling Implication:</strong> Standard hydraulic solvers assume continuous, single-phase flow. 
                  To model vacuum sewers in ICM, friction parameters must be adjusted (reduced C-factors) to account for 
                  the energy losses from this complex two-phase flow regime.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
