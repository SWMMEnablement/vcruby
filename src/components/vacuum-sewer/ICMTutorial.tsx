import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, Play, Download, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ICMTutorial = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle>InfoWorks ICM Ruby Script Tutorials</CardTitle>
          </div>
          <CardDescription>
            Step-by-step guides for running each Ruby script in InfoWorks ICM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sawtooth" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sawtooth">Sawtooth Generator</TabsTrigger>
              <TabsTrigger value="calculator">Vacuum Calculator</TabsTrigger>
              <TabsTrigger value="exporter">JSON Exporter</TabsTrigger>
            </TabsList>

            {/* Sawtooth Generator Tutorial */}
            <TabsContent value="sawtooth" className="space-y-4 mt-4">
              <Alert>
                <AlertDescription>
                  <strong>Purpose:</strong> Automatically converts a single conduit into a realistic sawtooth profile
                  with alternating gravity runs and vacuum lifts.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Badge className="mt-1 shrink-0">Step 1</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">Prepare Your Network</h4>
                    <p className="text-sm text-muted-foreground">
                      Open your InfoWorks ICM network and draw a single "guide" conduit between your start and end points.
                      This conduit represents the path where you want the sawtooth pattern to be created.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1 shrink-0">Step 2</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">Select the Guide Conduit</h4>
                    <p className="text-sm text-muted-foreground">
                      Click on the conduit you want to convert. Make sure only ONE conduit is selected.
                      The script will validate this before running.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1 shrink-0">Step 3</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">Open Ruby Script Editor</h4>
                    <p className="text-sm text-muted-foreground">
                      In InfoWorks ICM, go to <strong>Network</strong> → <strong>Run Ruby Script</strong>.
                      This opens the Ruby script editor window.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1 shrink-0">Step 4</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">Load the Script</h4>
                    <p className="text-sm text-muted-foreground">
                      Copy the contents of <code>sawtooth_generator.rb</code> and paste it into the editor,
                      or use the <strong>File → Open</strong> menu to load the .rb file directly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1 shrink-0">Step 5</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">Run the Script</h4>
                    <p className="text-sm text-muted-foreground">
                      Click the <strong>Run</strong> button. A dialog will appear asking for parameters:
                    </p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
                      <li><strong>Run Length:</strong> Length of gravity sections (typically 50-100m)</li>
                      <li><strong>Run Slope:</strong> Downward slope (0.002 = 0.2%, typical range 0.001-0.005)</li>
                      <li><strong>Lift Height:</strong> Vertical rise at each lift (typically 1.0-2.0m)</li>
                      <li><strong>Lift Length:</strong> Horizontal length of lift sections (typically 2-5m)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1 shrink-0">Step 6</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">Verify Results</h4>
                    <p className="text-sm text-muted-foreground">
                      The script will create multiple nodes and conduits with naming pattern <code>ST_[node]_[step]_L/H</code>.
                      Check the Output window for success messages and verify the sawtooth pattern visually.
                    </p>
                  </div>
                </div>

                <Alert className="mt-4">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Tip:</strong> The original guide conduit is automatically deleted after successful execution.
                    Use Ctrl+Z to undo if you need to adjust parameters.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            {/* Vacuum Calculator Tutorial */}
            <TabsContent value="calculator" className="space-y-4 mt-4">
              <Alert>
                <AlertDescription>
                  <strong>Purpose:</strong> Calculates cumulative vacuum head requirements at each node using
                  EPA sawtooth methodology, accounting for friction losses and lifts.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Badge className="mt-1 shrink-0">Step 1</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">Prepare Network Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Ensure your network has the following data populated:
                    </p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
                      <li><strong>Link User Number 1:</strong> Flow rate (L/s) for each conduit</li>
                      <li><strong>Link Roughness:</strong> Hazen-Williams C value (use 100 for conservative vacuum design)</li>
                      <li><strong>US/DS Inverts:</strong> Proper elevation data on all conduits</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1 shrink-0">Step 2</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">Identify Vacuum Station</h4>
                    <p className="text-sm text-muted-foreground">
                      Either mark your vacuum station node as an <strong>Outfall</strong> type, or select the vacuum
                      station node before running the script. The script traces upstream from this point.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1 shrink-0">Step 3</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">Run the Script</h4>
                    <p className="text-sm text-muted-foreground">
                      Open Ruby Script Editor (<strong>Network → Run Ruby Script</strong>), load
                      <code>calculate_vacuum_epa.rb</code>, and click <strong>Run</strong>.
                      The script will automatically traverse the network upstream.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1 shrink-0">Step 4</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">Review Results</h4>
                    <p className="text-sm text-muted-foreground">
                      Check <strong>Node User Number 9</strong> for each node. This value represents the cumulative
                      vacuum head (in meters) required at that location.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1 shrink-0">Step 5</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">Validate System</h4>
                    <p className="text-sm text-muted-foreground">
                      Review all User Number 9 values. If any exceed <strong>3.5m</strong>, the system may experience
                      hydraulic lock. Consider redesigning that section with shorter runs or lower lifts.
                    </p>
                  </div>
                </div>

                <Alert className="mt-4">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> The sawtooth principle means downhill slopes do NOT reduce required head
                    (energy is lost to air separation). Only lifts add to head requirements.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            {/* JSON Exporter Tutorial */}
            <TabsContent value="exporter" className="space-y-4 mt-4">
              <Alert>
                <AlertDescription>
                  <strong>Purpose:</strong> Exports complete network model data and simulation results to JSON format
                  for external analysis, integration, or visualization.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Badge className="mt-1 shrink-0">Step 1</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">Open Network (Optional: Load Results)</h4>
                    <p className="text-sm text-muted-foreground">
                      Open your InfoWorks ICM network. If you want to export simulation results, make sure to load
                      a completed simulation first via <strong>Results → Load Results</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1 shrink-0">Step 2</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">Run Export Script</h4>
                    <p className="text-sm text-muted-foreground">
                      Open Ruby Script Editor, load <code>export_model_json.rb</code>, and click <strong>Run</strong>.
                      A file dialog will appear.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1 shrink-0">Step 3</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">Choose Export Location</h4>
                    <p className="text-sm text-muted-foreground">
                      Select a location and filename for your JSON export (e.g., <code>model_export.json</code>).
                      The script will handle all data serialization automatically.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1 shrink-0">Step 4</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">Monitor Progress</h4>
                    <p className="text-sm text-muted-foreground">
                      Watch the Output window for progress messages. Large networks may take several minutes.
                      The script processes all tables, nodes, links, and time-series results.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge className="mt-1 shrink-0">Step 5</Badge>
                  <div>
                    <h4 className="font-semibold mb-1">Use Exported Data</h4>
                    <p className="text-sm text-muted-foreground">
                      The JSON file contains:
                    </p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
                      <li><strong>meta:</strong> Export metadata (date, user, ICM version, scenario)</li>
                      <li><strong>timesteps:</strong> Array of simulation timesteps</li>
                      <li><strong>inputs:</strong> All model input data organized by table</li>
                      <li><strong>results:</strong> Time-series and scalar simulation results (if loaded)</li>
                    </ul>
                  </div>
                </div>

                <Alert className="mt-4">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Tip:</strong> Use this JSON export to feed data into custom analysis tools, visualization
                    dashboards, or machine learning models. The format is compatible with Python, JavaScript, and most
                    modern data processing tools.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
