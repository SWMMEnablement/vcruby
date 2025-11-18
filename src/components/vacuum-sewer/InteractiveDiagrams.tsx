import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Network, Building2, Droplet } from "lucide-react";

const InteractiveDiagrams = () => {
  const [activeValvePart, setActiveValvePart] = useState<string | null>(null);
  const [activeSawtoothPart, setActiveSawtoothPart] = useState<string | null>(null);
  const [activeStationPart, setActiveStationPart] = useState<string | null>(null);

  const valvePitParts = {
    valve: { name: "Vacuum Interface Valve", desc: "Opens when 40 gal collected, admits sewage and air into vacuum main" },
    sensor: { name: "Sensor/Controller", desc: "Monitors sump level and controls valve timing (typically 7-10 sec open)" },
    sump: { name: "Valve Pit Sump", desc: "Collects sewage by gravity from 3-4 homes (40 gal capacity typical)" },
    gravityLine: { name: "Gravity Service Lines", desc: "4\" lines from homes, minimum 2% slope, run 75-150 ft to valve pit" },
    vacuumMain: { name: "Vacuum Main", desc: "3-8\" diameter, runs at 3-4 ft depth in sawtooth profile under vacuum" },
  };

  const sawtoothParts = {
    lift: { name: "Lift Sections", desc: "Upward slopes: maximum 5% grade, 15 ft max rise per section" },
    drop: { name: "Drop Sections", desc: "Downward slopes: minimum 0.5%, maximum 2% grade for efficient transport" },
    divisionValve: { name: "Division Valve", desc: "Isolates sections for maintenance, installed at high points" },
    lowPoint: { name: "Low Point", desc: "Sewage collects here during transport, should be accessible for cleanout" },
  };

  const stationParts = {
    vacuumPumps: { name: "Vacuum Pumps", desc: "Maintain 16-20 inHg vacuum, typically 2-3 pumps with redundancy" },
    collectionTank: { name: "Collection Tank", desc: "Receives sewage from vacuum mains, 1000-3000 gal capacity" },
    dischargePumps: { name: "Discharge Pumps", desc: "Transfer sewage to treatment plant or gravity sewer" },
    vacuumReserve: { name: "Vacuum Reserve Tank", desc: "Maintains system vacuum during pump cycles, 200-500 gal" },
    controls: { name: "Control Panel", desc: "Monitors vacuum level, tank levels, pump operation, alarms" },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-6 w-6 text-engineering-blue" />
            Interactive System Diagrams
          </CardTitle>
          <CardDescription>Technical schematics with detailed annotations from EPA Chapter 3</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="valve" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="valve">Valve Pit</TabsTrigger>
              <TabsTrigger value="sawtooth">Sawtooth Profile</TabsTrigger>
              <TabsTrigger value="station">Vacuum Station</TabsTrigger>
            </TabsList>

            <TabsContent value="valve" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-secondary rounded-lg p-6">
                  <svg viewBox="0 0 400 500" className="w-full" style={{ maxHeight: "600px" }}>
                    {/* Ground level */}
                    <line x1="0" y1="80" x2="400" y2="80" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeDasharray="5,5" />
                    <text x="10" y="70" fill="hsl(var(--muted-foreground))" fontSize="12">Ground Level</text>

                    {/* Homes */}
                    <rect x="30" y="30" width="40" height="40" fill="hsl(var(--engineering-teal))" opacity="0.3" stroke="hsl(var(--engineering-teal))" strokeWidth="2" />
                    <text x="50" y="25" fill="hsl(var(--foreground))" fontSize="11" textAnchor="middle">Home 1</text>
                    <rect x="130" y="40" width="40" height="30" fill="hsl(var(--engineering-teal))" opacity="0.3" stroke="hsl(var(--engineering-teal))" strokeWidth="2" />
                    <text x="150" y="35" fill="hsl(var(--foreground))" fontSize="11" textAnchor="middle">Home 2</text>
                    <rect x="230" y="35" width="40" height="35" fill="hsl(var(--engineering-teal))" opacity="0.3" stroke="hsl(var(--engineering-teal))" strokeWidth="2" />
                    <text x="250" y="30" fill="hsl(var(--foreground))" fontSize="11" textAnchor="middle">Home 3</text>

                    {/* Gravity service lines */}
                    <g 
                      onMouseEnter={() => setActiveValvePart("gravityLine")}
                      onMouseLeave={() => setActiveValvePart(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <line x1="50" y1="70" x2="200" y2="150" stroke="hsl(var(--engineering-teal))" strokeWidth="4" opacity={activeValvePart === "gravityLine" ? 1 : 0.6} />
                      <line x1="150" y1="70" x2="200" y2="150" stroke="hsl(var(--engineering-teal))" strokeWidth="4" opacity={activeValvePart === "gravityLine" ? 1 : 0.6} />
                      <line x1="250" y1="70" x2="200" y2="150" stroke="hsl(var(--engineering-teal))" strokeWidth="4" opacity={activeValvePart === "gravityLine" ? 1 : 0.6} />
                      <text x="120" y="110" fill="hsl(var(--engineering-teal))" fontSize="10">4" gravity</text>
                      <text x="120" y="122" fill="hsl(var(--engineering-teal))" fontSize="10">2% slope</text>
                    </g>

                    {/* Valve pit structure */}
                    <rect x="150" y="150" width="100" height="180" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="3" rx="5" />
                    <text x="200" y="145" fill="hsl(var(--foreground))" fontSize="12" fontWeight="bold" textAnchor="middle">Valve Pit</text>

                    {/* Sump */}
                    <g 
                      onMouseEnter={() => setActiveValvePart("sump")}
                      onMouseLeave={() => setActiveValvePart(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <rect x="160" y="240" width="80" height="80" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2" opacity={activeValvePart === "sump" ? 1 : 0.7} />
                      <rect x="160" y="280" width="80" height="40" fill="hsl(var(--engineering-blue))" opacity="0.4" />
                      <text x="200" y="305" fill="hsl(var(--foreground))" fontSize="11" textAnchor="middle">Sump</text>
                      <text x="200" y="317" fill="hsl(var(--muted-foreground))" fontSize="9" textAnchor="middle">40 gal</text>
                    </g>

                    {/* Sensor */}
                    <g 
                      onMouseEnter={() => setActiveValvePart("sensor")}
                      onMouseLeave={() => setActiveValvePart(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <rect x="170" y="165" width="60" height="30" fill="hsl(var(--primary))" opacity={activeValvePart === "sensor" ? 1 : 0.7} rx="3" />
                      <text x="200" y="183" fill="hsl(var(--primary-foreground))" fontSize="10" textAnchor="middle">Sensor/</text>
                      <text x="200" y="193" fill="hsl(var(--primary-foreground))" fontSize="10" textAnchor="middle">Controller</text>
                    </g>

                    {/* Valve */}
                    <g 
                      onMouseEnter={() => setActiveValvePart("valve")}
                      onMouseLeave={() => setActiveValvePart(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle cx="200" cy="220" r="18" fill="hsl(var(--engineering-blue))" opacity={activeValvePart === "valve" ? 1 : 0.7} />
                      <rect x="192" y="212" width="16" height="16" fill="hsl(var(--background))" />
                      <line x1="200" y1="212" x2="200" y2="228" stroke="hsl(var(--engineering-blue))" strokeWidth="3" />
                      <text x="230" y="225" fill="hsl(var(--foreground))" fontSize="10">Vacuum</text>
                      <text x="230" y="236" fill="hsl(var(--foreground))" fontSize="10">Valve</text>
                    </g>

                    {/* Vacuum main connection */}
                    <g 
                      onMouseEnter={() => setActiveValvePart("vacuumMain")}
                      onMouseLeave={() => setActiveValvePart(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <line x1="200" y1="330" x2="200" y2="380" stroke="hsl(var(--engineering-blue))" strokeWidth="6" opacity={activeValvePart === "vacuumMain" ? 1 : 0.6} />
                      <line x1="200" y1="380" x2="350" y2="380" stroke="hsl(var(--engineering-blue))" strokeWidth="6" opacity={activeValvePart === "vacuumMain" ? 1 : 0.6} />
                      <text x="280" y="375" fill="hsl(var(--engineering-blue))" fontSize="11">To Vacuum Main</text>
                      <text x="280" y="390" fill="hsl(var(--engineering-blue))" fontSize="9">(16-20 inHg vacuum)</text>
                    </g>

                    {/* Depth markers */}
                    <line x1="20" y1="80" x2="20" y2="330" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
                    <line x1="15" y1="80" x2="25" y2="80" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
                    <line x1="15" y1="330" x2="25" y2="330" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
                    <text x="35" y="210" fill="hsl(var(--muted-foreground))" fontSize="11">3-5 ft</text>
                    <text x="35" y="222" fill="hsl(var(--muted-foreground))" fontSize="11">depth</text>
                  </svg>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg mb-4">Valve Pit Components</h3>
                  {Object.entries(valvePitParts).map(([key, part]) => (
                    <div 
                      key={key}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        activeValvePart === key 
                          ? 'bg-primary/10 border-primary' 
                          : 'bg-card border-border hover:border-primary/50'
                      }`}
                      onMouseEnter={() => setActiveValvePart(key)}
                      onMouseLeave={() => setActiveValvePart(null)}
                    >
                      <h4 className="font-semibold text-sm mb-1">{part.name}</h4>
                      <p className="text-xs text-muted-foreground">{part.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sawtooth" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-secondary rounded-lg p-6">
                  <svg viewBox="0 0 500 350" className="w-full">
                    {/* Ground level */}
                    <line x1="0" y1="80" x2="500" y2="80" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeDasharray="5,5" />
                    <text x="10" y="70" fill="hsl(var(--muted-foreground))" fontSize="12">Ground Level</text>

                    {/* Sawtooth profile path */}
                    <g 
                      onMouseEnter={() => setActiveSawtoothPart("drop")}
                      onMouseLeave={() => setActiveSawtoothPart(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <line x1="50" y1="150" x2="120" y2="165" stroke="hsl(var(--engineering-blue))" strokeWidth="6" opacity={activeSawtoothPart === "drop" ? 1 : 0.6} />
                      <text x="75" y="175" fill="hsl(var(--engineering-blue))" fontSize="10">0.5-2%</text>
                      <text x="75" y="187" fill="hsl(var(--engineering-blue))" fontSize="10">drop</text>
                    </g>

                    <g 
                      onMouseEnter={() => setActiveSawtoothPart("lift")}
                      onMouseLeave={() => setActiveSawtoothPart(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <line x1="120" y1="165" x2="150" y2="120" stroke="hsl(var(--accent))" strokeWidth="6" opacity={activeSawtoothPart === "lift" ? 1 : 0.6} />
                      <text x="135" y="155" fill="hsl(var(--accent))" fontSize="10">5% lift</text>
                      <text x="130" y="167" fill="hsl(var(--accent))" fontSize="10">15 ft max</text>
                    </g>

                    <g 
                      onMouseEnter={() => setActiveSawtoothPart("drop")}
                      onMouseLeave={() => setActiveSawtoothPart(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <line x1="150" y1="120" x2="220" y2="135" stroke="hsl(var(--engineering-blue))" strokeWidth="6" opacity={activeSawtoothPart === "drop" ? 1 : 0.6} />
                    </g>

                    <g 
                      onMouseEnter={() => setActiveSawtoothPart("lift")}
                      onMouseLeave={() => setActiveSawtoothPart(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <line x1="220" y1="135" x2="250" y2="105" stroke="hsl(var(--accent))" strokeWidth="6" opacity={activeSawtoothPart === "lift" ? 1 : 0.6} />
                    </g>

                    <g 
                      onMouseEnter={() => setActiveSawtoothPart("drop")}
                      onMouseLeave={() => setActiveSawtoothPart(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <line x1="250" y1="105" x2="320" y2="120" stroke="hsl(var(--engineering-blue))" strokeWidth="6" opacity={activeSawtoothPart === "drop" ? 1 : 0.6} />
                    </g>

                    <g 
                      onMouseEnter={() => setActiveSawtoothPart("lift")}
                      onMouseLeave={() => setActiveSawtoothPart(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <line x1="320" y1="120" x2="350" y2="95" stroke="hsl(var(--accent))" strokeWidth="6" opacity={activeSawtoothPart === "lift" ? 1 : 0.6} />
                    </g>

                    <g 
                      onMouseEnter={() => setActiveSawtoothPart("drop")}
                      onMouseLeave={() => setActiveSawtoothPart(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <line x1="350" y1="95" x2="420" y2="110" stroke="hsl(var(--engineering-blue))" strokeWidth="6" opacity={activeSawtoothPart === "drop" ? 1 : 0.6} />
                    </g>

                    {/* Division valves at high points */}
                    <g 
                      onMouseEnter={() => setActiveSawtoothPart("divisionValve")}
                      onMouseLeave={() => setActiveSawtoothPart(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle cx="150" cy="120" r="10" fill="hsl(var(--primary))" opacity={activeSawtoothPart === "divisionValve" ? 1 : 0.7} />
                      <text x="150" y="115" fill="white" fontSize="16" textAnchor="middle">V</text>
                      <text x="150" y="145" fill="hsl(var(--foreground))" fontSize="9" textAnchor="middle">Division</text>
                      <text x="150" y="155" fill="hsl(var(--foreground))" fontSize="9" textAnchor="middle">Valve</text>
                      
                      <circle cx="250" cy="105" r="10" fill="hsl(var(--primary))" opacity={activeSawtoothPart === "divisionValve" ? 1 : 0.7} />
                      <text x="250" y="100" fill="white" fontSize="16" textAnchor="middle">V</text>
                      
                      <circle cx="350" cy="95" r="10" fill="hsl(var(--primary))" opacity={activeSawtoothPart === "divisionValve" ? 1 : 0.7} />
                      <text x="350" y="90" fill="white" fontSize="16" textAnchor="middle">V</text>
                    </g>

                    {/* Low points */}
                    <g 
                      onMouseEnter={() => setActiveSawtoothPart("lowPoint")}
                      onMouseLeave={() => setActiveSawtoothPart(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle cx="120" cy="165" r="8" fill="hsl(var(--engineering-teal))" opacity={activeSawtoothPart === "lowPoint" ? 1 : 0.7} />
                      <circle cx="220" cy="135" r="8" fill="hsl(var(--engineering-teal))" opacity={activeSawtoothPart === "lowPoint" ? 1 : 0.7} />
                      <circle cx="320" cy="120" r="8" fill="hsl(var(--engineering-teal))" opacity={activeSawtoothPart === "lowPoint" ? 1 : 0.7} />
                      <text x="120" y="180" fill="hsl(var(--engineering-teal))" fontSize="9" textAnchor="middle">Low pt</text>
                    </g>

                    {/* Direction arrow */}
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                        <polygon points="0 0, 10 3, 0 6" fill="hsl(var(--foreground))" />
                      </marker>
                    </defs>
                    <line x1="30" y1="150" x2="440" y2="110" stroke="hsl(var(--foreground))" strokeWidth="2" markerEnd="url(#arrowhead)" opacity="0.3" />
                    <text x="230" y="240" fill="hsl(var(--foreground))" fontSize="13" textAnchor="middle">Flow Direction to Vacuum Station →</text>

                    {/* Air/sewage transport illustration */}
                    <g opacity="0.5">
                      <circle cx="80" cy="155" r="4" fill="hsl(var(--engineering-teal))" />
                      <circle cx="90" cy="158" r="4" fill="hsl(var(--engineering-teal))" />
                      <circle cx="100" cy="160" r="4" fill="hsl(var(--engineering-teal))" />
                      <text x="105" y="163" fill="hsl(var(--engineering-teal))" fontSize="9">Sewage slugs</text>

                      <circle cx="170" cy="115" r="3" fill="hsl(var(--muted-foreground))" />
                      <circle cx="180" cy="118" r="3" fill="hsl(var(--muted-foreground))" />
                      <circle cx="190" cy="120" r="3" fill="hsl(var(--muted-foreground))" />
                      <text x="195" y="123" fill="hsl(var(--muted-foreground))" fontSize="9">Air pockets</text>
                    </g>

                    {/* Depth scale */}
                    <line x1="470" y1="80" x2="470" y2="165" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
                    <line x1="465" y1="80" x2="475" y2="80" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
                    <line x1="465" y1="165" x2="475" y2="165" stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
                    <text x="440" y="130" fill="hsl(var(--muted-foreground))" fontSize="10">3-4 ft</text>

                    {/* Profile specs */}
                    <rect x="20" y="220" width="460" height="100" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" rx="5" />
                    <text x="30" y="240" fill="hsl(var(--foreground))" fontSize="11" fontWeight="bold">Sawtooth Profile Specifications (EPA 3.4.2):</text>
                    <text x="30" y="260" fill="hsl(var(--muted-foreground))" fontSize="10">• Lift sections: Maximum 5% grade, 15 ft vertical rise limit</text>
                    <text x="30" y="275" fill="hsl(var(--muted-foreground))" fontSize="10">• Drop sections: 0.5% minimum, 2% maximum grade</text>
                    <text x="30" y="290" fill="hsl(var(--muted-foreground))" fontSize="10">• Transport velocity: 15-18 ft/sec for sewage slugs</text>
                    <text x="30" y="305" fill="hsl(var(--muted-foreground))" fontSize="10">• Division valves at high points for maintenance isolation</text>
                  </svg>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg mb-4">Sawtooth Profile Elements</h3>
                  {Object.entries(sawtoothParts).map(([key, part]) => (
                    <div 
                      key={key}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        activeSawtoothPart === key 
                          ? 'bg-primary/10 border-primary' 
                          : 'bg-card border-border hover:border-primary/50'
                      }`}
                      onMouseEnter={() => setActiveSawtoothPart(key)}
                      onMouseLeave={() => setActiveSawtoothPart(null)}
                    >
                      <h4 className="font-semibold text-sm mb-1">{part.name}</h4>
                      <p className="text-xs text-muted-foreground">{part.desc}</p>
                    </div>
                  ))}

                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Why Sawtooth?</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      The sawtooth profile enables vacuum sewers to work in flat terrain. Sewage is transported as 
                      discrete slugs separated by air pockets at high velocity (15-18 ft/sec).
                    </p>
                    <Badge variant="outline" className="text-xs">EPA Section 3.4.2</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="station" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-secondary rounded-lg p-6">
                  <svg viewBox="0 0 450 550" className="w-full">
                    {/* Station building outline */}
                    <rect x="50" y="50" width="350" height="450" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="3" rx="5" />
                    <text x="225" y="35" fill="hsl(var(--foreground))" fontSize="14" fontWeight="bold" textAnchor="middle">Vacuum Station Schematic</text>

                    {/* Control panel */}
                    <g 
                      onMouseEnter={() => setActiveStationPart("controls")}
                      onMouseLeave={() => setActiveStationPart(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <rect x="70" y="80" width="100" height="80" fill="hsl(var(--primary))" opacity={activeStationPart === "controls" ? 1 : 0.7} rx="3" />
                      <text x="120" y="110" fill="hsl(var(--primary-foreground))" fontSize="12" textAnchor="middle" fontWeight="bold">CONTROL</text>
                      <text x="120" y="125" fill="hsl(var(--primary-foreground))" fontSize="12" textAnchor="middle" fontWeight="bold">PANEL</text>
                      <circle cx="90" cy="140" r="4" fill="hsl(var(--primary-foreground))" />
                      <circle cx="105" cy="140" r="4" fill="hsl(var(--primary-foreground))" />
                      <circle cx="135" cy="140" r="4" fill="hsl(var(--primary-foreground))" />
                      <circle cx="150" cy="140" r="4" fill="hsl(var(--primary-foreground))" />
                    </g>

                    {/* Vacuum pumps */}
                    <g 
                      onMouseEnter={() => setActiveStationPart("vacuumPumps")}
                      onMouseLeave={() => setActiveStationPart(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <rect x="230" y="80" width="60" height="70" fill="hsl(var(--engineering-blue))" opacity={activeStationPart === "vacuumPumps" ? 1 : 0.7} rx="3" />
                      <text x="260" y="110" fill="white" fontSize="11" textAnchor="middle">Pump</text>
                      <text x="260" y="125" fill="white" fontSize="11" textAnchor="middle">#1</text>
                      <circle cx="260" cy="135" r="8" fill="white" opacity="0.5" />
                      
                      <rect x="310" y="80" width="60" height="70" fill="hsl(var(--engineering-blue))" opacity={activeStationPart === "vacuumPumps" ? 1 : 0.7} rx="3" />
                      <text x="340" y="110" fill="white" fontSize="11" textAnchor="middle">Pump</text>
                      <text x="340" y="125" fill="white" fontSize="11" textAnchor="middle">#2</text>
                      <circle cx="340" cy="135" r="8" fill="white" opacity="0.5" />
                      
                      <text x="300" y="175" fill="hsl(var(--engineering-blue))" fontSize="10" textAnchor="middle">Vacuum Pumps</text>
                      <text x="300" y="187" fill="hsl(var(--engineering-blue))" fontSize="9" textAnchor="middle">16-20 inHg</text>
                    </g>

                    {/* Vacuum reserve tank */}
                    <g 
                      onMouseEnter={() => setActiveStationPart("vacuumReserve")}
                      onMouseLeave={() => setActiveStationPart(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <ellipse cx="120" cy="250" rx="50" ry="70" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2" opacity={activeStationPart === "vacuumReserve" ? 1 : 0.7} />
                      <text x="120" y="250" fill="hsl(var(--foreground))" fontSize="10" textAnchor="middle">Vacuum</text>
                      <text x="120" y="262" fill="hsl(var(--foreground))" fontSize="10" textAnchor="middle">Reserve</text>
                      <text x="120" y="274" fill="hsl(var(--muted-foreground))" fontSize="9" textAnchor="middle">200-500 gal</text>
                    </g>

                    {/* Collection tank */}
                    <g 
                      onMouseEnter={() => setActiveStationPart("collectionTank")}
                      onMouseLeave={() => setActiveStationPart(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <rect x="210" y="210" width="160" height="140" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="3" opacity={activeStationPart === "collectionTank" ? 1 : 0.7} rx="5" />
                      <rect x="210" y="270" width="160" height="80" fill="hsl(var(--engineering-teal))" opacity="0.4" />
                      <text x="290" y="250" fill="hsl(var(--foreground))" fontSize="12" fontWeight="bold" textAnchor="middle">Collection Tank</text>
                      <text x="290" y="310" fill="hsl(var(--foreground))" fontSize="10" textAnchor="middle">Sewage Level</text>
                      <text x="290" y="340" fill="hsl(var(--muted-foreground))" fontSize="9" textAnchor="middle">1000-3000 gal</text>
                      
                      {/* Level sensors */}
                      <line x1="220" y1="290" x2="360" y2="290" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="3,3" />
                      <text x="215" y="288" fill="hsl(var(--primary))" fontSize="8">High</text>
                      <line x1="220" y1="330" x2="360" y2="330" stroke="hsl(var(--destructive))" strokeWidth="1" strokeDasharray="3,3" />
                      <text x="215" y="328" fill="hsl(var(--destructive))" fontSize="8">Low</text>
                    </g>

                    {/* Discharge pumps */}
                    <g 
                      onMouseEnter={() => setActiveStationPart("dischargePumps")}
                      onMouseLeave={() => setActiveStationPart(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <rect x="240" y="370" width="50" height="50" fill="hsl(var(--accent))" opacity={activeStationPart === "dischargePumps" ? 1 : 0.7} rx="3" />
                      <circle cx="265" cy="395" r="15" fill="white" opacity="0.5" />
                      <text x="265" y="400" fill="hsl(var(--accent-foreground))" fontSize="11" textAnchor="middle" fontWeight="bold">P1</text>
                      
                      <rect x="310" y="370" width="50" height="50" fill="hsl(var(--accent))" opacity={activeStationPart === "dischargePumps" ? 1 : 0.7} rx="3" />
                      <circle cx="335" cy="395" r="15" fill="white" opacity="0.5" />
                      <text x="335" y="400" fill="hsl(var(--accent-foreground))" fontSize="11" textAnchor="middle" fontWeight="bold">P2</text>
                      
                      <text x="300" y="445" fill="hsl(var(--accent))" fontSize="10" textAnchor="middle">Discharge Pumps</text>
                    </g>

                    {/* Vacuum mains inlet */}
                    <line x1="0" y1="280" x2="80" y2="280" stroke="hsl(var(--engineering-blue))" strokeWidth="6" />
                    <text x="20" y="270" fill="hsl(var(--engineering-blue))" fontSize="10">Vacuum</text>
                    <text x="20" y="282" fill="hsl(var(--engineering-blue))" fontSize="10">Mains In</text>
                    <polygon points="75,280 65,275 65,285" fill="hsl(var(--engineering-blue))" />

                    {/* Discharge outlet */}
                    <line x1="370" y1="395" x2="450" y2="395" stroke="hsl(var(--accent))" strokeWidth="5" />
                    <text x="375" y="385" fill="hsl(var(--accent))" fontSize="10">To Treatment</text>
                    <text x="375" y="397" fill="hsl(var(--accent))" fontSize="10">or Gravity Line</text>
                    <polygon points="445,395 435,390 435,400" fill="hsl(var(--accent))" />

                    {/* Vacuum connection lines */}
                    <line x1="260" y1="150" x2="260" y2="210" stroke="hsl(var(--engineering-blue))" strokeWidth="3" opacity="0.5" />
                    <line x1="340" y1="150" x2="340" y2="210" stroke="hsl(var(--engineering-blue))" strokeWidth="3" opacity="0.5" />
                    <line x1="170" y1="250" x2="210" y2="250" stroke="hsl(var(--engineering-blue))" strokeWidth="3" opacity="0.5" />
                  </svg>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg mb-4">Vacuum Station Components</h3>
                  {Object.entries(stationParts).map(([key, part]) => (
                    <div 
                      key={key}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        activeStationPart === key 
                          ? 'bg-primary/10 border-primary' 
                          : 'bg-card border-border hover:border-primary/50'
                      }`}
                      onMouseEnter={() => setActiveStationPart(key)}
                      onMouseLeave={() => setActiveStationPart(null)}
                    >
                      <h4 className="font-semibold text-sm mb-1">{part.name}</h4>
                      <p className="text-xs text-muted-foreground">{part.desc}</p>
                    </div>
                  ))}

                  <div className="mt-6 space-y-3">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Station Sizing (EPA 3.7)
                      </h4>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>• ≤50 homes: ~$179k station</p>
                        <p>• 50-100 homes: ~$263k station</p>
                        <p>• 100-200 homes: ~$368k station</p>
                        <p>• {'>'}200 homes: ~$525k+ station</p>
                      </div>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Droplet className="h-4 w-4" />
                        Operation Cycle
                      </h4>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>1. Vacuum pumps maintain system vacuum</p>
                        <p>2. Sewage enters collection tank</p>
                        <p>3. At high level, discharge pumps activate</p>
                        <p>4. Pumps transfer to treatment/gravity</p>
                        <p>5. Cycle repeats automatically</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveDiagrams;