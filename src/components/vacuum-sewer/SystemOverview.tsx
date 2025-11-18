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
  );
};

export default SystemOverview;
