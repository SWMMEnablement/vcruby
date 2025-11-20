import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Droplets, Gauge, Zap } from "lucide-react";

const SystemOverview = () => {
  return (
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
    </Tabs>
  );
};

export default SystemOverview;
