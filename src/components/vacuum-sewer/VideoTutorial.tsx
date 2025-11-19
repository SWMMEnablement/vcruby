import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Video, Upload, ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const VideoTutorial = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            <CardTitle>Video Tutorials</CardTitle>
          </div>
          <CardDescription>
            Watch step-by-step video demonstrations of running Ruby scripts in InfoWorks ICM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sawtooth" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sawtooth">Sawtooth Generator</TabsTrigger>
              <TabsTrigger value="calculator">Vacuum Calculator</TabsTrigger>
              <TabsTrigger value="exporter">JSON Exporter</TabsTrigger>
            </TabsList>

            {/* Sawtooth Generator Video */}
            <TabsContent value="sawtooth" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 p-8">
                  <Play className="h-16 w-16 text-muted-foreground" />
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-lg">Video Tutorial: Sawtooth Pattern Generator</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      This video will demonstrate how to select a guide conduit, run the Ruby script, 
                      and configure sawtooth parameters in InfoWorks ICM
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Video
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Add YouTube Link
                    </Button>
                  </div>
                </div>

                {/* Key Timestamps */}
                <Card className="bg-secondary/50">
                  <CardHeader>
                    <CardTitle className="text-base">Video Chapters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="shrink-0">0:00</Badge>
                        <div>
                          <p className="font-semibold">Introduction</p>
                          <p className="text-muted-foreground">Overview of sawtooth pattern concept</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="shrink-0">0:30</Badge>
                        <div>
                          <p className="font-semibold">Network Preparation</p>
                          <p className="text-muted-foreground">Drawing the guide conduit and setting elevations</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="shrink-0">1:15</Badge>
                        <div>
                          <p className="font-semibold">Running the Script</p>
                          <p className="text-muted-foreground">Opening Ruby editor and loading the script file</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="shrink-0">2:00</Badge>
                        <div>
                          <p className="font-semibold">Parameter Configuration</p>
                          <p className="text-muted-foreground">Setting run length, slope, lift height, and lift length</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="shrink-0">3:00</Badge>
                        <div>
                          <p className="font-semibold">Verifying Results</p>
                          <p className="text-muted-foreground">Inspecting generated nodes and conduits</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Tips */}
                <Alert>
                  <AlertDescription>
                    <strong>Quick Tips:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                      <li>Always save your network before running the script</li>
                      <li>Start with default parameters (50m run, 0.002 slope, 1.5m lift)</li>
                      <li>Use Ctrl+Z immediately after running if results aren't as expected</li>
                      <li>Check the Output window for detailed logging messages</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            {/* Vacuum Calculator Video */}
            <TabsContent value="calculator" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 p-8">
                  <Play className="h-16 w-16 text-muted-foreground" />
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-lg">Video Tutorial: EPA Vacuum Head Calculator</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Learn how to prepare network data, identify the vacuum station, 
                      and interpret cumulative head results
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Video
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Add YouTube Link
                    </Button>
                  </div>
                </div>

                {/* Key Timestamps */}
                <Card className="bg-secondary/50">
                  <CardHeader>
                    <CardTitle className="text-base">Video Chapters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="shrink-0">0:00</Badge>
                        <div>
                          <p className="font-semibold">EPA Sawtooth Methodology</p>
                          <p className="text-muted-foreground">Understanding the physics of vacuum sewers</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="shrink-0">1:00</Badge>
                        <div>
                          <p className="font-semibold">Data Preparation</p>
                          <p className="text-muted-foreground">Populating flow rates, roughness values, and inverts</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="shrink-0">2:30</Badge>
                        <div>
                          <p className="font-semibold">Marking Vacuum Station</p>
                          <p className="text-muted-foreground">Setting node type to Outfall or selecting the station node</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="shrink-0">3:15</Badge>
                        <div>
                          <p className="font-semibold">Running Calculation</p>
                          <p className="text-muted-foreground">Executing the script and monitoring progress</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="shrink-0">4:30</Badge>
                        <div>
                          <p className="font-semibold">Analyzing Results</p>
                          <p className="text-muted-foreground">Reading User Number 9 values and identifying problem areas</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Tips */}
                <Alert>
                  <AlertDescription>
                    <strong>Critical Checks:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                      <li>Verify all pipes have flow data in User Number 1</li>
                      <li>Use conservative C-factor (100) for initial analysis</li>
                      <li>Any node with User Number 9 &gt; 3.5m needs redesign</li>
                      <li>Review upstream nodes with highest head requirements first</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            {/* JSON Exporter Video */}
            <TabsContent value="exporter" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 p-8">
                  <Play className="h-16 w-16 text-muted-foreground" />
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-lg">Video Tutorial: Model & Results JSON Exporter</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Export complete network data and simulation results for external analysis tools
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Video
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Add YouTube Link
                    </Button>
                  </div>
                </div>

                {/* Key Timestamps */}
                <Card className="bg-secondary/50">
                  <CardHeader>
                    <CardTitle className="text-base">Video Chapters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="shrink-0">0:00</Badge>
                        <div>
                          <p className="font-semibold">Use Cases</p>
                          <p className="text-muted-foreground">When and why to export network data to JSON</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="shrink-0">0:45</Badge>
                        <div>
                          <p className="font-semibold">Loading Results</p>
                          <p className="text-muted-foreground">Optional: Loading simulation results before export</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="shrink-0">1:30</Badge>
                        <div>
                          <p className="font-semibold">Running Export Script</p>
                          <p className="text-muted-foreground">Selecting output location and filename</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="shrink-0">2:15</Badge>
                        <div>
                          <p className="font-semibold">Monitoring Progress</p>
                          <p className="text-muted-foreground">Watching table processing in the Output window</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="shrink-0">3:30</Badge>
                        <div>
                          <p className="font-semibold">Using Exported Data</p>
                          <p className="text-muted-foreground">Opening JSON in Python, JavaScript, or Excel</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Tips */}
                <Alert>
                  <AlertDescription>
                    <strong>Performance Tips:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                      <li>Large networks may take 5-10 minutes to export</li>
                      <li>Close other applications to free up memory during export</li>
                      <li>JSON files can be large (100+ MB) for complex networks</li>
                      <li>Use Python's json.load() for efficient parsing of large files</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>

          {/* General Instructions */}
          <Card className="mt-6 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base">Recording Your Own Tutorials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                To add your own video content to these placeholders, you can:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>
                  <strong>Screen Recording Tools:</strong> Use OBS Studio, Camtasia, or Windows Game Bar to record your ICM screen
                </li>
                <li>
                  <strong>Upload to YouTube:</strong> Upload videos as unlisted and embed the links here
                </li>
                <li>
                  <strong>Direct Video Files:</strong> Place .mp4 files in the public folder and reference them
                </li>
                <li>
                  <strong>Animated GIFs:</strong> Use LICEcap or ScreenToGif for shorter demonstrations
                </li>
              </ol>
              <Alert className="mt-4">
                <AlertDescription>
                  <strong>Recommended Recording Settings:</strong> 1920x1080 resolution, 30fps, 
                  with clear audio narration explaining each step. Keep videos under 5 minutes for best engagement.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
