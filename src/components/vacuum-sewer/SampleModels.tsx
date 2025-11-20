import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, FileCode, Network, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import sampleNetworkImage from "@/assets/icm-vacuum-demo-network.png";

export const SampleModels = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="w-5 h-5" />
          Sample ICM Models
        </CardTitle>
        <CardDescription>
          Pre-configured vacuum sewer networks for testing and learning the Ruby scripts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            These sample models are designed to help you understand vacuum sewer design principles and test the Ruby scripts before applying them to your own projects.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    Vacuum Sewer Demo Network
                    <Badge variant="secondary">Pre-configured</Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Simple 3-branch vacuum system with sawtooth profiles
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <img 
                src={sampleNetworkImage} 
                alt="ICM InfoWorks vacuum sewer demo network showing sawtooth profiles"
                className="w-full border rounded"
              />
            </div>

            <div className="p-4 bg-muted/50 space-y-4">
              <div>
                <h5 className="font-semibold text-sm mb-2">Network Components:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Nodes:</span> H1, H2, H3 (High Points)
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Nodes:</span> N1, N2 (Low Points)
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Station:</span> W.W, W.W.1 (Vacuum Stations)
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Pipes:</span> P1, P2, P3 (Sawtooth Profiles)
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Pattern:</span> DOWN-UP-DOWN-UP
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Outfall:</span> out_OUTFALL1
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h5 className="font-semibold text-sm mb-2">What You Can Test:</h5>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>
                    <span className="font-medium text-foreground">Sawtooth Generator:</span> Select any existing pipe to split it into 4-segment vacuum profile
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Vacuum Calculator:</span> Calculate vacuum head at each node (select outfall first)
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Export Model JSON:</span> Export complete network data for external analysis
                  </li>
                </ul>
              </div>

              <div className="border-t pt-4">
                <h5 className="font-semibold text-sm mb-2">Expected Results:</h5>
                <div className="bg-background p-3 rounded border text-xs font-mono space-y-1">
                  <p className="text-green-600 dark:text-green-400">✓ Node H1: ~0.8m vacuum head (GREEN ZONE)</p>
                  <p className="text-green-600 dark:text-green-400">✓ Node H2: ~1.6m vacuum head (GREEN ZONE)</p>
                  <p className="text-green-600 dark:text-green-400">✓ Node H3: ~2.4m vacuum head (GREEN ZONE)</p>
                  <p className="text-muted-foreground">All nodes within optimal range (0-3.0m)</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="w-full" disabled>
                  <Download className="w-4 h-4 mr-2" />
                  Download .icmm File
                </Button>
                <Button variant="outline" size="sm" className="w-full" disabled>
                  <FileCode className="w-4 h-4 mr-2" />
                  Download SQL Script
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Model files available upon request - contact support
              </p>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h5 className="font-semibold text-sm mb-3">How to Use This Model:</h5>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <Badge className="bg-purple-500 shrink-0">1</Badge>
                <div>
                  <p className="font-medium">Open in InfoWorks ICM</p>
                  <p className="text-muted-foreground text-xs">Load the demo network in your ICM installation</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className="bg-purple-500 shrink-0">2</Badge>
                <div>
                  <p className="font-medium">Test Sawtooth Generator</p>
                  <p className="text-muted-foreground text-xs">Select pipe N1.1 or N2.1 and run the script to create sawtooth pattern</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className="bg-green-500 shrink-0">3</Badge>
                <div>
                  <p className="font-medium">Run Vacuum Calculator</p>
                  <p className="text-muted-foreground text-xs">Select the OUTFALL1 node and execute the calculator script to verify vacuum heads</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className="bg-blue-500 shrink-0">4</Badge>
                <div>
                  <p className="font-medium">Export Results</p>
                  <p className="text-muted-foreground text-xs">Use the export script to save your network data as JSON for further analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
