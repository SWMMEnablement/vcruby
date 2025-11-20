import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Droplets, Gauge, Zap } from "lucide-react";
import dropInletDiagram from "@/assets/drop-inlet-diagram.png";
import soilOdorFilter from "@/assets/soil-odor-filter.png";

const SystemOverview = () => {
  return (
    <Tabs defaultValue="introduction" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="introduction">Introduction</TabsTrigger>
        <TabsTrigger value="epa-section">EPA Section 1.3</TabsTrigger>
        <TabsTrigger value="chapter-3">Chapter 3</TabsTrigger>
        <TabsTrigger value="chapter-5">Chapter 5</TabsTrigger>
      </TabsList>

      <TabsContent value="introduction">
        <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-6 w-6 text-engineering-blue" />
            Introduction to Vacuum Sewer Systems
          </CardTitle>
          <CardDescription>Chapter 3.1 - System Fundamentals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground leading-relaxed">
            Vacuum sewer systems provide an alternative to conventional gravity sewers, particularly effective
            in flat terrain, areas with high water tables, or where conventional systems would require deep
            excavation and multiple lift stations.
          </p>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Unlike pressure systems that push wastewater, vacuum systems pull wastewater through pipes using
              differential air pressure (typically 16-20 inches Hg vacuum).
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Advantages</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <span>Requires less excavation depth (typically 3-4 feet)</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <span>Eliminates infiltration and exfiltration issues</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <span>Can handle significant elevation changes</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <span>Self-cleaning due to high velocities</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <span>Odor-free operation (sealed system)</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                <span>Flat or gently sloping terrain</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                <span>High groundwater table areas</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                <span>Rocky or difficult excavation conditions</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                <span>Environmentally sensitive areas</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                <span>Retrofit projects</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-engineering-teal" />
            System Operating Principles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Vacuum Level
              </h4>
              <p className="text-sm text-muted-foreground">
                Maintained at 16-20 inches Hg (54-68 kPa) at the vacuum station
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Droplets className="h-4 w-4 text-primary" />
                Transport
              </h4>
              <p className="text-sm text-muted-foreground">
                Wastewater and air mixture travels at 15-18 ft/sec through pipes
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Gauge className="h-4 w-4 text-primary" />
                Collection
              </h4>
              <p className="text-sm text-muted-foreground">
                Vacuum valves admit wastewater in controlled cycles (3-5 seconds)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle>Major System Components</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="flex items-start gap-3 p-3 bg-card rounded-lg">
              <div className="font-bold text-primary text-lg">1</div>
              <div>
                <h4 className="font-semibold">Valve Pits</h4>
                <p className="text-sm text-muted-foreground">
                  Collection sumps with vacuum interface valves that admit wastewater into the system
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-card rounded-lg">
              <div className="font-bold text-primary text-lg">2</div>
              <div>
                <h4 className="font-semibold">Vacuum Mains</h4>
                <p className="text-sm text-muted-foreground">
                  PVC pipes (3-8 inches diameter) that transport wastewater/air mixture
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-card rounded-lg">
              <div className="font-bold text-primary text-lg">3</div>
              <div>
                <h4 className="font-semibold">Central Vacuum Station</h4>
                <p className="text-sm text-muted-foreground">
                  Houses vacuum pumps, collection tank, and discharge pumps
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-card rounded-lg">
              <div className="font-bold text-primary text-lg">4</div>
              <div>
                <h4 className="font-semibold">Service Lines</h4>
                <p className="text-sm text-muted-foreground">
                  4-6 inch gravity lines connecting individual homes to valve pits
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
        </div>
      </TabsContent>

      <TabsContent value="epa-section">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-6 w-6 text-engineering-blue" />
                Section 1.3 - Vacuum Systems
              </CardTitle>
              <CardDescription>EPA Manual - Alternative Wastewater Collection Systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                This section covers vacuum sewer systems as documented in the EPA's Alternative Wastewater 
                Collection Systems Manual (EPA/625/1-91/024, October 1991).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1.3.1 History and Development</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                The Liljendahl-Electrolux system was first used in the Bahamas in the 1960s. A Vac-Q-Tec system, 
                serving the Lake of the Woods development near Fredericksburg, Virginia, was the first residential 
                vacuum collection system in the United States.
              </p>
              <p className="text-foreground leading-relaxed">
                Four manufacturers have played a major role in the development of vacuum sewer systems: 
                Liljendahl-Electrolux, Colt-Envirovac, Vac-Q-Tec, and AIRVAC. There are significant differences 
                in overall system philosophy, design concepts, system components, and marketing approaches. While 
                all four were active 20 years ago in the United States, only AIRVAC has continued to place 
                residential systems into operation on a regular basis.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1.3.2 System Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed font-semibold">Services</p>
              <p className="text-foreground leading-relaxed">
                Wastewater flows by gravity from one or more homes into a 114-L (30-gal) holding tank. As the 
                wastewater level rises in the sump, air is compressed in a sensor tube connected to the valve 
                controller. At a preset point, the sensor signals for the vacuum valve to open. The valve stays 
                open for an adjustable period of time and then closes. During the open cycle, the holding tank 
                contents are evacuated.
              </p>

              <p className="text-foreground leading-relaxed font-semibold mt-4">Collection Piping</p>
              <p className="text-foreground leading-relaxed">
                The vacuum collection piping usually consists of 15-cm (6-in) and 10-cm (4-in) mains, although 
                more recent installations also include 25-cm (10-in) mains in some cases. Piping profiles differ, 
                depending on uphill, downhill, or level terrain. The pipe profiles recommended by each manufacturer 
                also differ.
              </p>

              <p className="text-foreground leading-relaxed font-semibold mt-4">Vacuum Station</p>
              <p className="text-foreground leading-relaxed">
                The vacuum station consists of a collection tank, vacuum reservoir tank, vacuum pumps, wastewater 
                discharge pumps, and control/monitoring equipment. The collection tank is the equivalent of a wet 
                well in a conventional pumping station. The vacuum pumps can be either liquid ring or sliding vane 
                type and are usually sized for 3-5 hr/d run-time.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1.3.3 Extent of Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                As of January 1990, there were approximately 35 operating residential vacuum sewer systems in the 
                United States, with another dozen or so in the construction phase. Many myths exist concerning 
                vacuum sewer systems, but in reality, a vacuum system is not unlike a conventional gravity system. 
                Wastewater flows from the individual homes and utilizes gravity to reach the point of connection 
                to the sewer main.
              </p>
              <p className="text-foreground leading-relaxed">
                The equipment used in the vacuum station is similar in mechanical complexity to that used in a 
                conventional lift station.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1.3.4 Myths vs. Reality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="border-l-4 border-primary pl-4">
                  <p className="font-semibold text-foreground">MYTH: Vacuum sewers are costly to operate.</p>
                  <p className="text-muted-foreground mt-2">
                    REALITY: The average sized vacuum station contains 20-hp vacuum pumps. Considering a run-time 
                    of 5 hr/d and the cost of electricity at $0.08/kWh, the cost of power for the vacuum pumps is 
                    about $185/month. A system of this size can typically serve 200-300 customers.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <p className="font-semibold text-foreground">
                    MYTH: The operation of a vacuum system requires a person with a college degree.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    REALITY: Any person that is mechanically inclined can operate a vacuum system. Most of the 
                    systems in operation in the U.S. have operators with no more than a high school education.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <p className="font-semibold text-foreground">
                    MYTH: Since vacuum sewers are mechanized, they undoubtedly are unreliable.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    REALITY: Early vacuum systems were not without their problems. However, component improvements, 
                    design advancements, and experience with the technology have resulted in systems that are very 
                    reliable.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <p className="font-semibold text-foreground">
                    MYTH: If the vacuum valve fails, wastewater will back up into my house.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    REALITY: Vacuum valves can fail in either the open or closed position. Failure in the closed 
                    position would be analogous to a blockage or surcharging of a gravity sewer. Fortunately, 
                    failure in this mode is rare. Almost all valve failures happen in the open position.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <p className="font-semibold text-foreground">
                    MYTH: Vacuum sewers are operation and maintenance intensive.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    REALITY: In general, vacuum sewers may be less costly to construct than conventional sewers, 
                    but may be more expensive to operate and maintain. However, the magnitude of the O&M effort 
                    has been greatly overstated. This is due largely to the little historical data that exist 
                    coupled with the conservative nature of most engineers.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <p className="font-semibold text-foreground">MYTH: Replacement parts are expensive.</p>
                  <p className="text-muted-foreground mt-2">
                    REALITY: The components of the vacuum station are not unlike those of a conventional pumping 
                    station. The small parts of the vacuum valve that are subjected to wear are very inexpensive. 
                    A vacuum valve and controller can be rebuilt for about $30. Rebuild frequency is 5-10 yr.
                  </p>
                </div>
              </div>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  In short, many of the major objections to the use of vacuum systems are not well founded. These 
                  systems have been acceptable in a variety of applications and locations.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="chapter-3">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-6 w-6 text-engineering-blue" />
                Chapter 3 - Vacuum Sewer Systems
              </CardTitle>
              <CardDescription>EPA Manual - Alternative Wastewater Collection Systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                Vacuum sewers have been used in Europe for over 100 years and in the United States for the last 
                25 years. Significant improvements in system components and operational techniques have made vacuum 
                sewer systems a reliable, cost-effective alternative for wastewater conveyance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3.1 Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                The use and acceptance of alternative wastewater collection systems have expanded greatly in the 
                last 20 years. These advancements have led to substantial reductions in water use, material costs, 
                excavation costs, and treatment expenses, resulting in overall cost effectiveness.
              </p>

              <p className="text-foreground leading-relaxed font-semibold mt-4">Key System Advantages</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Small pipe sizes: typically 7.5, 10, 15, and 20 cm (3, 4, 6, 8 inches)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>No manholes necessary</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Field changes easily made - can avoid underground obstacles</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Shallow installation depth eliminates wide, deep trenches</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>High scouring velocities reduce blockages, keep wastewater aerated and mixed</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Eliminates H₂S gas exposure risk for maintenance personnel</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Major leaks cannot go unnoticed - environmentally sound</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Only one power source required - at the vacuum station</span>
                </li>
              </ul>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Vacuum systems should be considered where terrain is unstable, flat, or has rolling land with 
                  many small elevation changes. The choice is typically made during planning stages based on 
                  cost-effectiveness analysis.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3.3 System Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                The history of vacuum sewer technology shows that four manufacturers have made significant 
                contributions: Liljendahl-Electrolux, Colt-Envirovac, Vac-Q-Tec, and AIRVAC. Presently, almost 
                all systems in operation in the United States are AIRVAC systems, though new competitors have 
                recently entered the market.
              </p>

              <p className="text-foreground leading-relaxed font-semibold mt-4">Major System Components</p>
              <div className="grid gap-3 mt-3">
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <div className="font-bold text-primary text-lg">1</div>
                  <div>
                    <h4 className="font-semibold">Valve Pits</h4>
                    <p className="text-sm text-muted-foreground">
                      Collection sumps with vacuum interface valves. Wastewater flows by gravity from homes into 
                      collection sumps where vacuum valves control entry into the system.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <div className="font-bold text-primary text-lg">2</div>
                  <div>
                    <h4 className="font-semibold">Service Lines</h4>
                    <p className="text-sm text-muted-foreground">
                      Gravity lines connecting individual homes to valve pits. Minimum burial depth of 75 cm (30 in).
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <div className="font-bold text-primary text-lg">3</div>
                  <div>
                    <h4 className="font-semibold">Vacuum Mains</h4>
                    <p className="text-sm text-muted-foreground">
                      Transport wastewater/air mixture from valve pits to central vacuum station. Various pipe 
                      sizes used based on design requirements.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <div className="font-bold text-primary text-lg">4</div>
                  <div>
                    <h4 className="font-semibold">Central Vacuum Station</h4>
                    <p className="text-sm text-muted-foreground">
                      Houses vacuum pumps, collection tank, discharge pumps, and control/monitoring equipment. 
                      Similar in complexity to conventional lift stations.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3.5 Construction Considerations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                Construction of vacuum sewer systems is similar to conventional systems but offers advantages. 
                Utilizing small diameter pipes in shallow trenches and having the ability to avoid underground 
                obstacles makes this construction attractive to contractors.
              </p>

              <p className="text-foreground leading-relaxed font-semibold mt-4">Installation Techniques</p>
              <div className="grid md:grid-cols-2 gap-4 mt-3">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Street Crossings</h4>
                  <p className="text-sm text-muted-foreground">
                    Often accomplished by bore method using auger with steel casing pushed into opening under street. 
                    Casing acts as sleeve for service line installed inside. Free boring with "hog" or open cutting 
                    where boring is impractical.
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Service Line Depth</h4>
                  <p className="text-sm text-muted-foreground">
                    Vacuum service lines buried minimum 75 cm (30 in), since vacuum line exits valve pit at depth 
                    of 68 cm (27 in). Proper bedding and backfill materials critical to prevent future problems.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3.6 Operation and Maintenance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed font-semibold">Operator Responsibilities</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Daily system inspection for efficiency, cleanliness, and maintenance needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Preparation of work schedules and operational reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Determination of remedial action during emergencies</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Maintenance of accurate operational cost records</span>
                </li>
              </ul>

              <p className="text-foreground leading-relaxed font-semibold mt-4">Operator Training</p>
              <p className="text-foreground leading-relaxed">
                It is desirable to hire the system operator during construction to become familiar with all 
                components. Manufacturers may offer lengthy training programs (e.g., 2 weeks) at their facilities, 
                including hands-on experience with clear PVC pipe systems to observe flow under various vacuum 
                conditions.
              </p>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Best training is gained by actual operating experience. During startup, the engineer should 
                  budget 3-6 month on-site training service to aid operators in fine tuning and troubleshooting. 
                  Operator attitude is vital to efficient system operation.
                </AlertDescription>
              </Alert>

              <p className="text-foreground leading-relaxed font-semibold mt-4">Spare Parts Inventory</p>
              <p className="text-foreground leading-relaxed">
                For optimum efficiency, maintain sufficient spare parts inventory. Some parts can be purchased 
                locally, but vacuum-specific components should be included in construction contract. Especially 
                vital are spare microprocessor-based electronic components for level controls and fault monitoring.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3.7 Evaluation of Operating Systems</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed font-semibold">Early Systems</p>
              <p className="text-foreground leading-relaxed">
                Early vacuum systems were often plagued with operational problems due to insufficient field 
                experience and lack of operation and maintenance guidelines. Issues included valve boot ruptures 
                during power outages and deformed valve pits in unstable soil.
              </p>

              <p className="text-foreground leading-relaxed font-semibold mt-4">System Improvements</p>
              <p className="text-foreground leading-relaxed">
                Corrective measures have included:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Addition of standby power to prevent vacuum loss during outages</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Replacement with fiberglass pits capable of withstanding traffic loads</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Breather tube extensions and controller modifications</span>
                </li>
              </ul>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Better understanding of vacuum sewer hydraulics, improved components, and established O&M 
                  guidelines have led to significant operational improvements. Modern systems are highly reliable.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="chapter-5">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-6 w-6 text-engineering-teal" />
                Chapter 5 - Design Examples
              </CardTitle>
              <CardDescription>EPA Manual - Alternative Wastewater Collection Systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                This chapter provides comprehensive design examples for both pressure sewer and vacuum sewer 
                systems, including hydraulic calculations, pipe sizing, pump selection, and system design procedures.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Design Procedure Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                This example simplifies the procedure to convey basic ideas without unnecessary complication. 
                The design assumes single-phase flow conditions (no two-phase flow).
              </p>

              <p className="text-foreground leading-relaxed font-semibold mt-4">Design Steps</p>
              <div className="grid gap-3 mt-3">
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <div className="font-bold text-primary text-lg">1</div>
                  <div>
                    <h4 className="font-semibold">Group and Total Dwelling Units</h4>
                    <p className="text-sm text-muted-foreground">
                      On a plan of the area to be served, group homes or dwelling units (DU) and total them into 
                      accumulated nodes (e.g., 270 DU, 80 DU, 45 DU).
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <div className="font-bold text-primary text-lg">2</div>
                  <div>
                    <h4 className="font-semibold">Select Trial Pipe Diameter</h4>
                    <p className="text-sm text-muted-foreground">
                      For each reach between nodes, select trial pipe diameter and determine slope of hydraulic 
                      grade line (S) and velocity (V).
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <div className="font-bold text-primary text-lg">3</div>
                  <div>
                    <h4 className="font-semibold">Draw Hydraulic Grade Line</h4>
                    <p className="text-sm text-muted-foreground">
                      Begin at the most downstream point and draw the hydraulic grade line based on calculated slopes.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <div className="font-bold text-primary text-lg">4</div>
                  <div>
                    <h4 className="font-semibold">Plot Tank Elevations</h4>
                    <p className="text-sm text-muted-foreground">
                      On profile, plot low liquid level elevations of each tank at stations where pump assemblies 
                      will be installed.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <div className="font-bold text-primary text-lg">5</div>
                  <div>
                    <h4 className="font-semibold">Calculate Head Differences</h4>
                    <p className="text-sm text-muted-foreground">
                      Scale elevation difference between liquid level in tank and hydraulic grade line to determine 
                      required pump head.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Design Equations and Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary p-4 rounded-lg space-y-4">
                <div>
                  <p className="text-foreground font-semibold mb-2">Equation 5-1: Design Flow</p>
                  <p className="font-mono text-sm bg-card p-3 rounded">Q = 0.5N + 20</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Where Q = Design flow (gpm), N = Number of homes served
                  </p>
                </div>

                <div>
                  <p className="text-foreground font-semibold mb-2">Equation 5-2: Hazen-Williams</p>
                  <p className="font-mono text-sm bg-card p-3 rounded">V = 1.318 C R^0.63 S^0.54</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Where V = Velocity (fps), C = Flow coefficient (140), R = Hydraulic radius, S = Slope of 
                    hydraulic grade line
                  </p>
                </div>
              </div>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Minimum scouring velocity: 60 cm/s (2 fps) for grinder pumps, preferably 90 cm/s (3 fps). 
                  For self-cleaning systems, minimum velocity is not usually considered.
                </AlertDescription>
              </Alert>

              <p className="text-foreground leading-relaxed font-semibold mt-4">Key Design Parameters</p>
              <div className="grid md:grid-cols-2 gap-4 mt-3">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Flow Coefficient</h4>
                  <p className="text-sm text-muted-foreground">
                    C = 140 (typical value for design calculations using Hazen-Williams equation)
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Pipe Sizing</h4>
                  <p className="text-sm text-muted-foreground">
                    Pipeline sizes taken as nominal. Minimum 3-inch mains recommended, though 2-inch mains can 
                    serve small numbers of DUs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vacuum Sewer Design Example</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                Vacuum sewer systems require careful consideration of lift arrangements, valve pit locations, 
                and pipeline profiles. The design must account for minimum slopes and proper lift spacing.
              </p>

              <p className="text-foreground leading-relaxed font-semibold mt-4">Design Considerations</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Sewers laid to fall in direction of flow at 0.2% (1 in 500) minimum slope</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Maximum pipe diameter between consecutively spaced lifts: 5-1/2 feet</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Minimum 40% slope for lifts with 40% fall</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Branch connections made via wye fittings dropping into vacuum main</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Valve pits positioned at strategic locations based on dwelling unit groups</span>
                </li>
              </ul>

              <div className="bg-secondary p-4 rounded-lg mt-4">
                <h4 className="font-semibold mb-3">Profile Design Requirements</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">Ground Surface Following</p>
                    <p className="text-sm text-muted-foreground">
                      Pipeline can follow ground surface at any slope greater than 0.2%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-2">Lift Arrangement</p>
                    <p className="text-sm text-muted-foreground">
                      Coming into a lift: culvert pipe drops to create vertical fall
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Line Loss Calculations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                Accurate calculation of head losses is critical for proper pump sizing and system performance. 
                Total losses include static losses and line losses.
              </p>

              <p className="text-foreground leading-relaxed font-semibold mt-4">Loss Components</p>
              <div className="grid gap-3 mt-3">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Static Losses</h4>
                  <p className="text-sm text-muted-foreground">
                    Elevation differences and fixed head requirements. Calculated based on station-to-station 
                    elevation changes and accumulated head requirements.
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Line Losses</h4>
                  <p className="text-sm text-muted-foreground">
                    Friction losses through piping. Calculated using Hazen-Williams equation with appropriate 
                    coefficients for pipe material and condition.
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Valve Losses</h4>
                  <p className="text-sm text-muted-foreground">
                    Minor losses at valve locations and fittings. Account for number of valves and crossovers 
                    in the system design.
                  </p>
                </div>
              </div>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Accumulated head losses should be kept under 13 ft for acceptable design. Design example shows 
                  accumulated losses of 11.97 ft, which is acceptable.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Piping Calculations and System Volumes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                System volume calculations are essential for determining collection tank sizing and understanding 
                system capacity. Calculations based on SDR 21 PVC pipe dimensions.
              </p>

              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-foreground font-semibold mb-3">Volume Calculation Formula</p>
                <p className="font-mono text-xs bg-card p-3 rounded mb-3">
                  V = (0.0547 × L₃ + 0.0904 × L₄ + 0.1950 × L₆ + 0.3321 × L₈) cu ft
                </p>
                <p className="text-sm text-muted-foreground">
                  Where L₃, L₄, L₆, L₈ = lengths of 3-in, 4-in, 6-in, and 8-in pipe respectively
                </p>
              </div>

              <p className="text-foreground leading-relaxed font-semibold mt-4">Design Example Summary</p>
              <div className="grid md:grid-cols-3 gap-4 mt-3">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Total Pipe Length</h4>
                  <p className="text-2xl font-bold text-primary">10,915 ft</p>
                  <p className="text-sm text-muted-foreground mt-1">Plus crossover lengths</p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Total Valves</h4>
                  <p className="text-2xl font-bold text-primary">83</p>
                  <p className="text-sm text-muted-foreground mt-1">Crossover valve locations</p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Homes Served</h4>
                  <p className="text-2xl font-bold text-primary">195</p>
                  <p className="text-sm text-muted-foreground mt-1">Total dwelling units</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-card border border-border rounded-lg">
                <h4 className="font-semibold mb-3">Pipe Distribution</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">6-inch pipe:</span>
                    <span className="font-semibold">2,400 ft (62 homes, 31 valves)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">8-inch pipe:</span>
                    <span className="font-semibold">4,815 ft (102 homes, 42 valves)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">4-inch pipe:</span>
                    <span className="font-semibold">3,700 ft (31 homes, 10 valves)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Design Acceptance Criteria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                A properly designed system must meet specific performance criteria to ensure reliable operation 
                and cost-effectiveness.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-secondary rounded-lg">
                  <h4 className="font-semibold mb-2 text-primary">✓ Head Loss Limits</h4>
                  <p className="text-sm text-muted-foreground">
                    Total accumulated head losses must remain under 13 ft for acceptable design performance.
                  </p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <h4 className="font-semibold mb-2 text-primary">✓ Velocity Requirements</h4>
                  <p className="text-sm text-muted-foreground">
                    Maintain minimum scouring velocities to prevent solids deposition and ensure self-cleaning.
                  </p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <h4 className="font-semibold mb-2 text-primary">✓ Pipe Sizing</h4>
                  <p className="text-sm text-muted-foreground">
                    Select appropriate pipe diameters based on flow rates and number of dwelling units served.
                  </p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <h4 className="font-semibold mb-2 text-primary">✓ Pump Selection</h4>
                  <p className="text-sm text-muted-foreground">
                    Size pumps based on total dynamic head including static lift and all system losses.
                  </p>
                </div>
              </div>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Design examples demonstrate practical application of hydraulic principles. Always verify 
                  calculations and consider site-specific conditions when applying these methods.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default SystemOverview;
