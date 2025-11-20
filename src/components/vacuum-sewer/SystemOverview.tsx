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
        <TabsTrigger value="section-5-2">Section 5.2</TabsTrigger>
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
                Chapter 3 - Pressure Sewer Systems
              </CardTitle>
              <CardDescription>EPA Manual - Alternative Wastewater Collection Systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                This chapter covers pressure sewer systems, including critical information about odor control, 
                corrosion management, and material specifications for system components.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2.4.7 Odors and Corrosion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed font-semibold">Wastewater Characteristics</p>
              <p className="text-foreground leading-relaxed">
                Grinder pump and solids handling pump basins are odorous only to the extent the fresh, raw 
                wastewater is retained in the basin for some time. When the wastewater becomes septic, it begins 
                producing hydrogen sulfide gas.
              </p>
              <p className="text-foreground leading-relaxed">
                With STEP systems, the tank effluent is always septic, and potentially odorous and corrosive. 
                Some of the H₂S can escape from the septic tank, however, and some may be captured by the floating 
                scum layer. The BOD of the effluent is lower than that of raw or ground wastewater. The septic 
                aspect of the wastewater in the mains presents no particular problem as the PVC pipelines are 
                unaffected.
              </p>

              <Alert className="my-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  A septic wastewater atmosphere is characterized as being odorous, corrosive, and toxic. The 
                  rotten egg odor of H₂S is repulsive and detectable in concentrations as low as 3 ppb.
                </AlertDescription>
              </Alert>

              <p className="text-foreground leading-relaxed font-semibold mt-4">Health and Safety Concerns</p>
              <p className="text-foreground leading-relaxed">
                H₂S causes acute poisoning, paralyzing the respiratory center. Methane is also produced by septic 
                wastewater, which is asphyxiating, as is the carbon dioxide and nitrogen present in wastewater gas. 
                When ventilated, the atmosphere in the pump vault is usually at a safe level for brief exposure.
              </p>
              <p className="text-foreground leading-relaxed">
                Because of the toxic and asphyxiating atmospheric conditions possible in the vaults, designs should 
                be made where exposure of the service personnel to these gases is unnecessary and difficult. More 
                than brief exposure is to be avoided.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Odor Control Strategies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                For odor control, basin covers are typically gasketed or made such that escaping gases are vented 
                into the soil, or ventilation is provided by the roof vent of the home. While H₂S is heavier than 
                air, it is presumed drafted away with the greater volume of air and lighter gases present.
              </p>
              <p className="text-foreground leading-relaxed">
                So long as turbulence is minimized in the basin to limit the amount of H₂S liberated, odors are 
                rarely reported via roof ventilation. In most cases where problems have been investigated, improper 
                house venting has been a major contributor.
              </p>

              <p className="text-foreground leading-relaxed font-semibold mt-4">Chemical Treatment Options</p>
              <div className="space-y-3 mt-3">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Chlorine</h4>
                  <p className="text-sm text-muted-foreground">
                    A strong oxidizing agent and bactericide. Requires proper mixing and safety precautions.
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Hydrogen Peroxide</h4>
                  <p className="text-sm text-muted-foreground">
                    Provides a source of oxygen for oxidation. Reacts instantly but requires proper dosing.
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Ferrous Sulfate</h4>
                  <p className="text-sm text-muted-foreground">
                    Acts as a catalyst for oxidation of sulfides or precipitates them. Requires substantial 
                    reaction time.
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Enzymes</h4>
                  <p className="text-sm text-muted-foreground">
                    Can be added by homeowners or maintenance districts. Also beneficial in reducing grease 
                    accumulation in pump vaults, but expensive for extended use.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Soil Odor Filter Design</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                Soil odor filters provide an effective, passive method for controlling odors from lift stations 
                and pump vaults. The system uses a geotextile fabric-wrapped perforated pipe buried in soil to 
                naturally filter and neutralize odorous gases.
              </p>
              <div className="bg-secondary p-4 rounded-lg">
                <img 
                  src={soilOdorFilter} 
                  alt="Soil odor filter detail showing side view and front view with dimensions and components"
                  className="w-full rounded-lg"
                />
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Figure: Soil odor filter detail with side and front views
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-3 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Key Components</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 16" min. perforated PVC pipe</li>
                    <li>• Geotextile fabric wrapping</li>
                    <li>• Vented cap to atmosphere</li>
                    <li>• 18" min. depth to water table</li>
                  </ul>
                </div>
                <div className="p-3 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Installation Requirements</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 12" min. above ground level</li>
                    <li>• 10" min. below ground</li>
                    <li>• 24" min. front width</li>
                    <li>• Clear of seasonal high water</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Material Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                Proper materials must be selected for resistance to corrosion. Most packages assembled by 
                manufacturers of pressure sewer components comply reasonably with this requirement.
              </p>
              
              <p className="text-foreground leading-relaxed font-semibold mt-4">Approved Materials</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Type 316 Stainless Steel - High corrosion resistance</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Type 304 Stainless Steel - Good corrosion resistance</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>PVC - Unaffected by septic conditions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Polyethylene - Resistant to corrosion</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>ABS - Suitable for specific applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>FRP (Fiber Reinforced Plastic) - Durable and corrosion resistant</span>
                </li>
              </ul>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Isolation valves should be made corrosion resistant, as should air release valves. Air releases 
                  should vent to an odor control facility, such as a soil absorption bed if much gas is expected 
                  to be expelled or if the air release is near habitation.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Design Considerations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                Some designs locate the vault within a few feet of the home, so wiring can pass directly from the 
                vault to the control panel without need for an electrical junction box in the pump vault. The 
                building sewer is short, reducing maintenance needs and reducing the possibility of receiving 
                infiltration from poorly made pipe joints.
              </p>
              <p className="text-foreground leading-relaxed">
                Where septic pressure sewer-collected effluent is discharged directly to a municipal treatment 
                facility, odors have not been a problem if the discharge is submerged and diffused, and if the 
                receiving basin is large, well mixed, and aerobic.
              </p>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Much information is available on the characteristics and pretreatment of septic wastewaters. 
                  Unfortunately, information has historically been ignored or poorly understood by the parties 
                  involved in design.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="section-5-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-6 w-6 text-engineering-teal" />
                Section 5.2 - Design Examples
              </CardTitle>
              <CardDescription>EPA Manual - Operation, Maintenance, and Installation Details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                This section provides comprehensive guidance on operation and maintenance procedures, interceptor 
                tank requirements, and installation specifications for alternative wastewater collection systems.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">4.5 Operation and Maintenance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed font-semibold">4.5.1 Administration</p>
              <p className="text-foreground leading-relaxed">
                Early SDGS systems attempted to utilize existing septic tanks at each connection as interceptor 
                tanks to minimize construction costs. In such instances, the existing tanks were pumped and 
                inspected prior to being accepted by the utility. However, where a significant number of existing 
                tanks were included, clear water infiltration and inflow has been a problem.
              </p>
              <p className="text-foreground leading-relaxed">
                Current practice is to install all new interceptor tanks to limit infiltration and inflow.
              </p>

              <Alert className="my-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  To provide the tightest system as possible, the user should be required to install a new 
                  building sewer subject to a leak test by the utility district. The existing tank must be 
                  pumped and abandoned by removal or by destruction and filling with inert solid material.
                </AlertDescription>
              </Alert>

              <p className="text-foreground leading-relaxed">
                The sewer utility should be responsible for maintenance of the entire system. This includes all 
                interceptor tanks and any appurtenances such as STEP units located on private property.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interceptor Tank Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed font-semibold">Location and Access</p>
              <p className="text-foreground leading-relaxed">
                The interceptor tanks should be located where they can be reached easily for routine pumping by 
                vacuum trucks. However, the tanks should be clear of any area subject to vehicular traffic. To 
                facilitate maintenance, the interceptor tanks have been located in the public right-of-way in 
                some projects.
              </p>
              <p className="text-foreground leading-relaxed">
                This approach avoids many of the problems associated with construction on private property, but 
                does increase the hookup cost to the property owner. However, since the interceptor tank is 
                critical to the proper performance of the SDGS system, responsibility for maintenance should be 
                retained by the district.
              </p>

              <div className="bg-secondary p-4 rounded-lg my-4">
                <p className="text-foreground font-semibold mb-2">Ownership Recommendation</p>
                <p className="text-muted-foreground">
                  It is strongly recommended that the district assume ownership or equivalent responsibility for 
                  the interceptor tank and the components downstream of the tank to ensure access and timely 
                  appropriate maintenance.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Installation Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                Tank installation must follow the manufacturer&apos;s specifications. Proper bedding and flexible, 
                water-tight inlet and outlet connections must be used. Flotation collars may be required to 
                prevent flotation when the tank is pumped in areas that experience high water conditions.
              </p>

              <p className="text-foreground leading-relaxed font-semibold mt-4">Critical Installation Steps</p>
              <div className="grid gap-3 mt-3">
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <div className="font-bold text-primary text-lg">1</div>
                  <div>
                    <h4 className="font-semibold">Proper Bedding</h4>
                    <p className="text-sm text-muted-foreground">
                      Use appropriate bedding materials according to manufacturer specifications to ensure 
                      structural integrity and prevent settling.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <div className="font-bold text-primary text-lg">2</div>
                  <div>
                    <h4 className="font-semibold">Water-Tight Connections</h4>
                    <p className="text-sm text-muted-foreground">
                      Install flexible, water-tight inlet and outlet connections to prevent infiltration and 
                      accommodate slight movement.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <div className="font-bold text-primary text-lg">3</div>
                  <div>
                    <h4 className="font-semibold">Flotation Prevention</h4>
                    <p className="text-sm text-muted-foreground">
                      Install flotation collars in high water table areas to prevent tank flotation when pumped.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                  <div className="font-bold text-primary text-lg">4</div>
                  <div>
                    <h4 className="font-semibold">Tank Filling for Testing</h4>
                    <p className="text-sm text-muted-foreground">
                      Fill tank to at least 60 cm (2 ft) above top to check covers and manhole riser connections.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Drop Inlet Configurations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                Drop inlets are used when the incoming sewer enters the pump station at a higher elevation than 
                the discharge level. Two configurations are commonly used: external drop inlets and internal 
                drop inlets.
              </p>
              <div className="bg-secondary p-4 rounded-lg">
                <img 
                  src={dropInletDiagram} 
                  alt="Drop inlet examples showing external and internal configurations with suspended level control sensors"
                  className="w-full rounded-lg"
                />
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Figure 4-13: Examples of drop inlets - external (a) and internal (b)
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2 text-primary">Outside Drop Inlet</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    The drop inlet is located external to the pump station wet well. Flow enters through a 
                    vertical pipe before entering the station.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Easier maintenance access</li>
                    <li>• Reduces turbulence in wet well</li>
                    <li>• Separate structure required</li>
                  </ul>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2 text-primary">Inside Drop Inlet</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    The drop inlet is integrated within the pump station using a tee configuration with strap 
                    mounting.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Compact design</li>
                    <li>• Lower installation cost</li>
                    <li>• Requires proper flow deflection</li>
                  </ul>
                </div>
              </div>
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Both configurations require suspended level control sensors and submersible sewage pumps. The 
                  choice depends on site conditions, budget, and maintenance access requirements.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Testing and Inspection Procedures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed font-semibold">Property Owner Responsibilities</p>
              <p className="text-foreground leading-relaxed">
                Typically, the property owner is responsible for testing of the building sewer to the satisfaction 
                of the utility district. Areas affected by the construction activities should be video taped to 
                provide a reference during restoration work before connection.
              </p>

              <p className="text-foreground leading-relaxed font-semibold mt-4">Leak Testing Protocol</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>New building sewer must be subject to leak test by utility district</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Tank should be filled to at least 60 cm (2 ft) above top of tank</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Check covers and manhole riser connections for proper sealing</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Video tape affected areas for restoration reference</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <span>Verify all connections meet water-tight requirements</span>
                </li>
              </ul>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Proper testing ensures system integrity and prevents infiltration/inflow problems that can 
                  significantly impact system performance and operating costs.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Maintenance Best Practices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                Since the interceptor tank is critical to the proper performance of the SDGS system, the district 
                should retain responsibility for maintenance to ensure access and timely appropriate maintenance.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">District Responsibilities</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Regular tank pumping schedule</li>
                    <li>• System inspection and monitoring</li>
                    <li>• Component maintenance and repairs</li>
                    <li>• Emergency response procedures</li>
                  </ul>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-semibold mb-2">Property Owner Responsibilities</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Initial building sewer testing</li>
                    <li>• Maintain access to tank location</li>
                    <li>• Report system issues promptly</li>
                    <li>• Comply with usage restrictions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default SystemOverview;
