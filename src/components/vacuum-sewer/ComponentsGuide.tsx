import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Box, Waves, Settings, Network } from "lucide-react";

const ComponentsGuide = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-engineering-blue" />
            System Components Guide
          </CardTitle>
          <CardDescription>Chapter 3.3 - Description of System Components</CardDescription>
        </CardHeader>
      </Card>

      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="valve-pits" className="border rounded-lg px-4 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Box className="h-5 w-5 text-primary" />
              <span className="font-semibold">Valve Pits & Interface Valves</span>
              <Badge variant="secondary">Critical Component</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-3">
              <div className="p-4 bg-secondary rounded-lg">
                <h4 className="font-semibold mb-2">Function</h4>
                <p className="text-sm text-muted-foreground">
                  Valve pits serve as the interface between gravity collection from homes and the vacuum
                  collection system. They contain a sump that collects wastewater and a pneumatically
                  operated valve that admits flow into the vacuum main.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-3 text-sm">Physical Specifications</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Material:</strong> Fiberglass or concrete</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Sump Volume:</strong> 35-65 gallons (10-17 gal effective)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Depth:</strong> 3-5 feet below grade</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Access:</strong> 24-inch diameter minimum</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-3 text-sm">Valve Operation</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Trigger:</strong> Pneumatic sensor at 10-gallon level</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Cycle Time:</strong> 3-5 seconds per cycle</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Air Admission:</strong> ~20 CFM during valve opening</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span><strong>Materials:</strong> Bronze body, neoprene diaphragm</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Design Considerations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Typical service: 1-4 homes per valve pit (up to 8 homes in some cases)</li>
                  <li>• Located at low points along property lines</li>
                  <li>• Must be accessible for maintenance (every 6-12 months)</li>
                  <li>• Sensor lines must be protected from freezing in cold climates</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="mains" className="border rounded-lg px-4 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Network className="h-5 w-5 text-primary" />
              <span className="font-semibold">Vacuum Mains & Service Lines</span>
              <Badge variant="secondary">Network</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold mb-3">Vacuum Mains</h4>
                <ul className="space-y-2 text-sm">
                  <li><strong>Material:</strong> PVC SDR-21 or better</li>
                  <li><strong>Sizes:</strong> 3", 4", 6", 8" diameter</li>
                  <li><strong>Joints:</strong> Solvent-welded or gasketed</li>
                  <li><strong>Depth:</strong> 3-4 feet minimum cover</li>
                  <li><strong>Slope:</strong> Sawtooth profile (0.2% min)</li>
                  <li><strong>Layout:</strong> Dendritic (tree-like pattern)</li>
                </ul>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-semibold mb-3">Service Lines</h4>
                <ul className="space-y-2 text-sm">
                  <li><strong>Material:</strong> PVC Schedule 40</li>
                  <li><strong>Size:</strong> 4" or 6" diameter</li>
                  <li><strong>Length:</strong> Typically 50-200 feet</li>
                  <li><strong>Slope:</strong> 1-2% toward valve pit</li>
                  <li><strong>Type:</strong> Gravity flow</li>
                  <li><strong>Connection:</strong> Building sewer to valve pit</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-secondary rounded-lg">
              <h4 className="font-semibold mb-2">Sawtooth Profile Design</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Vacuum mains use a characteristic "sawtooth" profile with alternating upslope and downslope
                sections separated by collection sumps (lift stations).
              </p>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="p-3 bg-card rounded">
                  <p className="font-semibold text-sm">Upslope</p>
                  <p className="text-xs text-muted-foreground">0.2% minimum slope</p>
                </div>
                <div className="p-3 bg-card rounded">
                  <p className="font-semibold text-sm">Downslope</p>
                  <p className="text-xs text-muted-foreground">0.5-1.0% slope</p>
                </div>
                <div className="p-3 bg-card rounded">
                  <p className="font-semibold text-sm">Lift Height</p>
                  <p className="text-xs text-muted-foreground">10-15 feet typical</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Installation Guidelines</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Minimum horizontal distance between lifts: based on EPA Table 3-4</li>
                <li>• Division valves installed at branches for isolation</li>
                <li>• Air release valves at high points</li>
                <li>• Inspection/cleanout ports every 400-600 feet</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="station" className="border rounded-lg px-4 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Waves className="h-5 w-5 text-primary" />
              <span className="font-semibold">Central Vacuum Station</span>
              <Badge variant="secondary">Core Facility</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="p-4 bg-secondary rounded-lg">
                <h4 className="font-semibold mb-2">Station Components</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  The vacuum station is the heart of the system, maintaining vacuum pressure and transferring
                  collected wastewater to the treatment facility or discharge point.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="p-4 border border-primary rounded-lg bg-primary/5">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-primary">1</span> Vacuum Pumps
                  </h4>
                  <ul className="space-y-1 text-sm ml-6">
                    <li><strong>Type:</strong> Liquid ring or rotary vane</li>
                    <li><strong>Configuration:</strong> Minimum 2 pumps (duty/standby)</li>
                    <li><strong>Capacity:</strong> 50-500 CFM depending on system size</li>
                    <li><strong>Operating Range:</strong> 16-20 inches Hg</li>
                    <li><strong>Power:</strong> 5-75 HP per pump</li>
                  </ul>
                </div>

                <div className="p-4 border border-primary rounded-lg bg-primary/5">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-primary">2</span> Collection/Holding Tank
                  </h4>
                  <ul className="space-y-1 text-sm ml-6">
                    <li><strong>Material:</strong> Steel, fiberglass, or concrete</li>
                    <li><strong>Capacity:</strong> 500-2000 gallons typical</li>
                    <li><strong>Design:</strong> 15-minute detention at peak flow</li>
                    <li><strong>Features:</strong> Level sensors, high-level alarm</li>
                    <li><strong>Access:</strong> Manhole for inspection and maintenance</li>
                  </ul>
                </div>

                <div className="p-4 border border-primary rounded-lg bg-primary/5">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-primary">3</span> Discharge Pumps
                  </h4>
                  <ul className="space-y-1 text-sm ml-6">
                    <li><strong>Type:</strong> Submersible or centrifugal</li>
                    <li><strong>Configuration:</strong> Duplex (2 pumps alternating)</li>
                    <li><strong>Impeller:</strong> Non-clog design</li>
                    <li><strong>Controls:</strong> Automatic alternation, level-activated</li>
                    <li><strong>Features:</strong> Check valves, isolation valves</li>
                  </ul>
                </div>

                <div className="p-4 border border-primary rounded-lg bg-primary/5">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-primary">4</span> Controls & Monitoring
                  </h4>
                  <ul className="space-y-1 text-sm ml-6">
                    <li><strong>PLC:</strong> Programmable logic controller</li>
                    <li><strong>Sensors:</strong> Vacuum level, tank level, pump status</li>
                    <li><strong>Alarms:</strong> High/low vacuum, high tank level, pump failure</li>
                    <li><strong>SCADA:</strong> Optional remote monitoring</li>
                    <li><strong>Backup Power:</strong> Generator or battery backup</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Typical Station Dimensions</h4>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="font-semibold">Small System (≤50 homes)</p>
                    <p className="text-muted-foreground">12' x 16' building</p>
                  </div>
                  <div>
                    <p className="font-semibold">Medium System (50-150 homes)</p>
                    <p className="text-muted-foreground">16' x 20' building</p>
                  </div>
                  <div>
                    <p className="font-semibold">Large System ({'>'}150 homes)</p>
                    <p className="text-muted-foreground">20' x 30' building</p>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card className="bg-accent/10 border-accent">
        <CardHeader>
          <CardTitle className="text-base">Manufacturer Systems</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            The EPA manual identifies several manufacturers with different system approaches:
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="p-3 border border-border rounded-lg bg-card">
              <h4 className="font-semibold text-sm mb-1">AIRVAC</h4>
              <p className="text-xs text-muted-foreground">
                Pneumatically controlled valves, most common in U.S. residential applications
              </p>
            </div>
            <div className="p-3 border border-border rounded-lg bg-card">
              <h4 className="font-semibold text-sm mb-1">Colt-Envirovac</h4>
              <p className="text-xs text-muted-foreground">
                Electric-pneumatic hybrid systems, used in some commercial applications
              </p>
            </div>
            <div className="p-3 border border-border rounded-lg bg-card">
              <h4 className="font-semibold text-sm mb-1">Vac-Q-Tec</h4>
              <p className="text-xs text-muted-foreground">
                Electrically controlled valves with AutoScan feature for flow management
              </p>
            </div>
            <div className="p-3 border border-border rounded-lg bg-card">
              <h4 className="font-semibold text-sm mb-1">Liljendahl-Electrolux</h4>
              <p className="text-xs text-muted-foreground">
                European design, includes vacuum toilets for complete system
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComponentsGuide;
