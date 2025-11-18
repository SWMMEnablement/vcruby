import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Code, Download, AlertCircle, CheckCircle2, AlertTriangle, XCircle, BookOpen, GitCompare, Wrench, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ICMIntegration = () => {
  const [comparisonInputs, setComparisonInputs] = useState({
    pipeLength: 100,
    diameter: 150,
    flow: 2.5,
    usInvert: 10.0,
    dsInvert: 10.5,
    roughness: 120,
  });

  const [comparisonResults, setComparisonResults] = useState<any>(null);

  const rubyScript = `# ==============================================================================
# ICM VACUUM SEWER CALCULATOR (EPA / SAWTOOTH METHOD)
# ==============================================================================
#
# This script calculates the Total Dynamic Head (TDH) required at every node
# based on the EPA "Sawtooth" principle for vacuum sewers.
#
# LOGIC:
# 1. Friction is calculated using Hazen-Williams.
# 2. Static Head is accumulative ONLY on positive lifts.
#    (Downhill slopes DO NOT reduce head required; energy is lost to airflow).
#
# REQUIRED INPUTS:
# - Link User Number 1: Flow Rate (L/s)
# - Link Roughness: Hazen-Williams C (Standard is usually 120-140, use 100 for conservative vacuum)
#
# OUTPUTS:
# - Node User Number 9: Cumulative Vacuum Head (m) required to lift sewage to station.
#
# ==============================================================================
net = WSApplication.current_network
net.transaction_begin

# ------------------------------------------------------------------------------
# 1. HELPER FUNCTIONS
# ------------------------------------------------------------------------------

# Hazen-Williams Friction Loss Formula
# Returns Head Loss (m) over the pipe length
def calc_friction_head(length, diameter_mm, roughness_c, flow_lps)
  return 0.0 if flow_lps <= 0
  
  d_m = diameter_mm / 1000.0
  q_cms = flow_lps / 1000.0
  
  # EPA/Standard HW Formula: hf = 10.67 * L * (Q/C)^1.852 * D^-4.87
  hf = 10.67 * length * ((q_cms / roughness_c) ** 1.852) * (d_m ** -4.87)
  return hf
end

# The "Sawtooth" Lift Calculator
# In vacuum systems, if a pipe goes down, we don't gain energy. If it goes up, we lose it.
def calc_static_lift(us_invert, ds_invert)
  diff = ds_invert - us_invert
  if diff > 0
    return diff # Uphill: We must lift this weight (Loss)
  else
    return 0.0  # Downhill: Energy is lost to air separation (No Gain)
  end
end

# ------------------------------------------------------------------------------
# 2. BUILD CONNECTIVITY MAP (Tracing Upstream)
# ------------------------------------------------------------------------------

puts "Building network graph..."

# Map: Downstream_Node_ID => Array of Incoming Links
upstream_links_map = Hash.new { |h, k| h[k] = [] }
vacuum_stations = []

# Iterate over all conduits to build the map
net.row_objects('hw_conduit').each do |link|
  ds_id = link['ds_node_id']
  upstream_links_map[ds_id] << link
end

# Identify Vacuum Station (Start Point)
# Strategy: Look for nodes marked as 'Outfall' or use currently selected node
selected_objects = net.selection

if selected_objects.size == 1 && selected_objects[0].table_name == 'hw_node'
  vacuum_stations << selected_objects[0]
else
  # Auto-detect Outfalls
  net.row_objects('hw_node').each do |node|
    if node['node_type'] == 'Outfall'
      vacuum_stations << node
    end
  end
end

if vacuum_stations.empty?
  puts "Error: No Vacuum Station found. Please select a start node or define an Outfall."
  net.transaction_commit
  exit
end

# ------------------------------------------------------------------------------
# 3. RECURSIVE CALCULATION
# ------------------------------------------------------------------------------

# We use a queue for Breadth-First Traversal from the Vacuum Station UPSTREAM
queue = []

# Initialize Station
vacuum_stations.each do |station|
  station['user_number_9'] = 0.0 # 0m Head required at the pump station inlet
  station.write
  queue << station['node_id']
  puts "Starting trace from Vacuum Station: #{station['node_id']}"
end

processed_nodes = {}

while !queue.empty?
  current_node_id = queue.shift
  
  # Get the calculated head at this current node (the downstream end of the next pipe)
  current_node = net.row_object('hw_node', current_node_id)
  current_head_req = current_node['user_number_9']
  
  # Find pipes flowing INTO this node
  incoming_links = upstream_links_map[current_node_id]
  
  incoming_links.each do |link|
    us_node_id = link['us_node_id']
    
    # Get Link Parameters
    flow = link['user_number_1'] || 0.0 # Flow in L/s
    len  = link['length'] || 0.0
    diam = link['conduit_width'] # Assuming circular (mm)
    c_val = link['roughness_value'] || 120.0 # Hazen-Williams C
    
    # 1. Calculate Friction Loss
    h_friction = calc_friction_head(len, diam, c_val, flow)
    
    # 2. Calculate Static Lift (The "Sawtooth" Logic)
    # Note: In ICM, US_Invert is the start, DS_Invert is the end.
    # If DS > US, the water flowed UPHILL (Lift).
    us_inv = link['us_invert']
    ds_inv = link['ds_invert']
    h_static = calc_static_lift(us_inv, ds_inv)
    
    # 3. Total Head at Upstream Node
    # Head at US Node = Head at DS Node + Friction Loss + Lift required to get over the hump
    total_head_at_us = current_head_req + h_friction + h_static
    
    # Update the Upstream Node
    us_node = net.row_object('hw_node', us_node_id)
    
    if us_node
      us_node['user_number_9'] = total_head_at_us
      us_node.write
      
      # Add to queue to continue tracing upstream
      unless processed_nodes[us_node_id]
        queue << us_node_id
        processed_nodes[us_node_id] = true
      end
    end
  end
end

net.transaction_commit
puts "Calculation Complete."
puts "Check 'User Number 9' on nodes for Vacuum Head requirements."
puts "WARNING: If User Number 9 > 3.5m, system may fail."`;

  const downloadScript = () => {
    const blob = new Blob([rubyScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calculate_vacuum_epa.rb';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const calculateComparison = () => {
    const { pipeLength, diameter, flow, usInvert, dsInvert, roughness } = comparisonInputs;
    
    // Standard ICM (Gravity) Calculation
    const d_m = diameter / 1000.0;
    const q_cms = flow / 1000.0;
    const frictionLoss = 10.67 * pipeLength * Math.pow(q_cms / roughness, 1.852) * Math.pow(d_m, -4.87);
    const staticHead_ICM = dsInvert - usInvert; // Full difference (can be negative)
    const totalHead_ICM = frictionLoss + staticHead_ICM;
    
    // EPA Sawtooth Method
    const staticHead_EPA = Math.max(0, dsInvert - usInvert); // Only positive lifts count
    const totalHead_EPA = frictionLoss + staticHead_EPA;
    
    // Energy difference
    const energyDifference = totalHead_EPA - totalHead_ICM;
    const percentDifference = Math.abs(energyDifference / totalHead_EPA * 100);
    
    setComparisonResults({
      friction: frictionLoss.toFixed(3),
      staticICM: staticHead_ICM.toFixed(3),
      staticEPA: staticHead_EPA.toFixed(3),
      totalICM: totalHead_ICM.toFixed(3),
      totalEPA: totalHead_EPA.toFixed(3),
      difference: energyDifference.toFixed(3),
      percentDiff: percentDifference.toFixed(1),
      slope: ((dsInvert - usInvert) / pipeLength * 100).toFixed(2),
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-6 w-6 text-engineering-blue" />
            ICM InfoWorks Integration
          </CardTitle>
          <CardDescription>
            Ruby script for EPA-compliant vacuum sewer calculations inside ICM InfoWorks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This specialized Ruby script implements <strong>EPA Option 2</strong> logic for vacuum sewers. 
              It calculates cumulative head loss using the "Sawtooth" rule, discarding downhill energy recovery 
              to accurately model slug flow dynamics.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="usage" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7 mb-4">
              <TabsTrigger value="usage">How to Use</TabsTrigger>
              <TabsTrigger value="script">Script</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="troubleshooting">Troubleshoot</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="interpretation">Results</TabsTrigger>
              <TabsTrigger value="theory">Theory</TabsTrigger>
            </TabsList>

            <TabsContent value="usage" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Prepare Your Network</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-secondary rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Badge>1</Badge> Populate Flows
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        You must populate <code className="bg-muted px-2 py-1 rounded text-xs">user_number_1</code> on 
                        your vacuum pipes (Links) with the Peak Flow (L/s). Copy results from a standard simulation or assign manual values.
                      </p>
                    </div>

                    <div className="p-4 bg-secondary rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Badge>2</Badge> Set Vacuum Station
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Ensure your Vacuum Station node type is set to <code className="bg-muted px-2 py-1 rounded text-xs">Outfall</code> or 
                        select it before running the script.
                      </p>
                    </div>

                    <div className="p-4 bg-secondary rounded-lg">
                      <h4 className="font-semibold mb-2">Field Mappings</h4>
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div className="p-3 bg-card rounded border border-border">
                          <p className="font-semibold text-engineering-blue mb-1">Input Flow</p>
                          <code className="text-xs">hw_conduit.user_number_1</code>
                          <p className="text-xs text-muted-foreground mt-1">(L/s)</p>
                        </div>
                        <div className="p-3 bg-card rounded border border-border">
                          <p className="font-semibold text-engineering-teal mb-1">Output Vacuum Head</p>
                          <code className="text-xs">hw_node.user_number_9</code>
                          <p className="text-xs text-muted-foreground mt-1">(Meters of Head)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Badge>3</Badge> Run the Script
                  </h3>
                  <ol className="space-y-2 text-sm list-decimal list-inside">
                    <li>Go to <strong>Network → Script → Run Ruby Script...</strong></li>
                    <li>Copy and paste the code from the "Ruby Script" tab</li>
                    <li>Click <strong>Run</strong></li>
                    <li>Check the console output for completion message</li>
                  </ol>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="script" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">calculate_vacuum_epa.rb</h3>
                  <p className="text-sm text-muted-foreground">EPA Sawtooth Method Implementation</p>
                </div>
                <Button onClick={downloadScript} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Script
                </Button>
              </div>

              <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs font-mono">
                  <code>{rubyScript}</code>
                </pre>
              </div>

              <Alert>
                <AlertDescription className="text-sm">
                  <strong>Tip:</strong> Save this file as <code>calculate_vacuum_epa.rb</code> and keep it 
                  in your ICM scripts folder for repeated use across projects.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitCompare className="h-5 w-5" />
                    ICM vs EPA Method Comparison
                  </CardTitle>
                  <CardDescription>
                    Compare standard ICM gravity simulation results with EPA vacuum sewer methodology
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This calculator demonstrates why standard ICM simulations produce incorrect results for vacuum sewers.
                    </AlertDescription>
                  </Alert>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Pipe Length (m)</Label>
                      <Input
                        type="number"
                        value={comparisonInputs.pipeLength}
                        onChange={(e) => setComparisonInputs({...comparisonInputs, pipeLength: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Diameter (mm)</Label>
                      <Input
                        type="number"
                        value={comparisonInputs.diameter}
                        onChange={(e) => setComparisonInputs({...comparisonInputs, diameter: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Flow (L/s)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={comparisonInputs.flow}
                        onChange={(e) => setComparisonInputs({...comparisonInputs, flow: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Upstream Invert (m)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={comparisonInputs.usInvert}
                        onChange={(e) => setComparisonInputs({...comparisonInputs, usInvert: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Downstream Invert (m)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={comparisonInputs.dsInvert}
                        onChange={(e) => setComparisonInputs({...comparisonInputs, dsInvert: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Roughness (C)</Label>
                      <Input
                        type="number"
                        value={comparisonInputs.roughness}
                        onChange={(e) => setComparisonInputs({...comparisonInputs, roughness: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>

                  <Button onClick={calculateComparison} className="w-full">Calculate Comparison</Button>

                  {comparisonResults && (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-2 border-engineering-teal">
                          <CardHeader>
                            <CardTitle className="text-lg text-engineering-teal">Standard ICM (Gravity)</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="p-3 bg-secondary rounded">
                              <p className="text-sm text-muted-foreground">Friction Loss</p>
                              <p className="text-2xl font-bold">{comparisonResults.friction} m</p>
                            </div>
                            <div className="p-3 bg-secondary rounded">
                              <p className="text-sm text-muted-foreground">Static Head (Net)</p>
                              <p className="text-2xl font-bold">{comparisonResults.staticICM} m</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {parseFloat(comparisonResults.staticICM) < 0 ? "↓ Energy gained from downhill" : "↑ Energy lost to lift"}
                              </p>
                            </div>
                            <div className="p-3 bg-engineering-teal/20 rounded border-2 border-engineering-teal">
                              <p className="text-sm text-muted-foreground">Total Head Required</p>
                              <p className="text-3xl font-bold text-engineering-teal">{comparisonResults.totalICM} m</p>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-2 border-engineering-blue">
                          <CardHeader>
                            <CardTitle className="text-lg text-engineering-blue">EPA Vacuum Method</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="p-3 bg-secondary rounded">
                              <p className="text-sm text-muted-foreground">Friction Loss</p>
                              <p className="text-2xl font-bold">{comparisonResults.friction} m</p>
                            </div>
                            <div className="p-3 bg-secondary rounded">
                              <p className="text-sm text-muted-foreground">Static Head (Sawtooth)</p>
                              <p className="text-2xl font-bold">{comparisonResults.staticEPA} m</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {parseFloat(comparisonResults.staticEPA) === 0 ? "↓ Downhill: No energy recovery" : "↑ Uphill: Full lift required"}
                              </p>
                            </div>
                            <div className="p-3 bg-engineering-blue/20 rounded border-2 border-engineering-blue">
                              <p className="text-sm text-muted-foreground">Total Head Required</p>
                              <p className="text-3xl font-bold text-engineering-blue">{comparisonResults.totalEPA} m</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card className={`border-2 ${Math.abs(parseFloat(comparisonResults.difference)) > 0.5 ? 'border-destructive bg-destructive/5' : 'border-primary bg-primary/5'}`}>
                        <CardHeader>
                          <CardTitle className="text-base">Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="p-3 bg-card rounded">
                              <p className="text-xs text-muted-foreground mb-1">Pipe Slope</p>
                              <p className="text-lg font-semibold">{comparisonResults.slope}%</p>
                            </div>
                            <div className="p-3 bg-card rounded">
                              <p className="text-xs text-muted-foreground mb-1">Head Difference</p>
                              <p className="text-lg font-semibold">{comparisonResults.difference} m</p>
                            </div>
                            <div className="p-3 bg-card rounded">
                              <p className="text-xs text-muted-foreground mb-1">Percent Error</p>
                              <p className="text-lg font-semibold">{comparisonResults.percentDiff}%</p>
                            </div>
                          </div>
                          <div className="p-4 bg-card rounded">
                            <p className="text-sm font-semibold mb-2">Interpretation:</p>
                            <p className="text-sm text-muted-foreground">
                              {parseFloat(comparisonResults.difference) > 0.5 
                                ? "⚠️ CRITICAL: Standard ICM significantly underestimates head requirements. Using ICM results would lead to system failure. The vacuum system needs " + comparisonResults.difference + "m MORE head than ICM predicts."
                                : parseFloat(comparisonResults.difference) > 0.1
                                ? "⚠️ WARNING: ICM underestimates head requirements by " + comparisonResults.difference + "m. This could affect system reliability."
                                : "✓ Minor difference. For this specific pipe configuration, both methods yield similar results (likely flat or uphill pipe)."}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="troubleshooting" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Common ICM Ruby Script Errors & Solutions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-destructive/10 rounded-lg border border-destructive">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        Error: "No Vacuum Station found"
                      </h4>
                      <div className="ml-6 space-y-2 text-sm">
                        <p className="text-muted-foreground"><strong>Cause:</strong> Script cannot identify the starting point for calculations.</p>
                        <div className="p-3 bg-card rounded">
                          <p className="font-semibold mb-1">Solutions:</p>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Set your vacuum station node type to <code className="bg-muted px-1">Outfall</code></li>
                            <li>OR: Select the vacuum station node BEFORE running the script</li>
                            <li>Verify node exists in network (check Node Grid)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-destructive/10 rounded-lg border border-destructive">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        Error: "undefined method for nil:NilClass" on user_number_1
                      </h4>
                      <div className="ml-6 space-y-2 text-sm">
                        <p className="text-muted-foreground"><strong>Cause:</strong> Flow data missing from links.</p>
                        <div className="p-3 bg-card rounded">
                          <p className="font-semibold mb-1">Solutions:</p>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Run a standard ICM simulation first to generate flows</li>
                            <li>Copy <code className="bg-muted px-1">Peak Flow</code> results to <code className="bg-muted px-1">user_number_1</code></li>
                            <li>Or manually populate user_number_1 for each link</li>
                            <li>Check: Link Grid → User Fields → User Number 1 should have values</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-destructive/10 rounded-lg border border-destructive">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        Results show 0.0m everywhere
                      </h4>
                      <div className="ml-6 space-y-2 text-sm">
                        <p className="text-muted-foreground"><strong>Cause:</strong> Network connectivity issues or flow direction problems.</p>
                        <div className="p-3 bg-card rounded">
                          <p className="font-semibold mb-1">Solutions:</p>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Verify all pipes are properly connected (no gaps)</li>
                            <li>Check flow direction: Should flow FROM homes TO station</li>
                            <li>Look for <code className="bg-muted px-1">us_node_id</code> and <code className="bg-muted px-1">ds_node_id</code> values</li>
                            <li>Ensure there are no isolated network segments</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        Warning: Values {'>'}10m at some nodes
                      </h4>
                      <div className="ml-6 space-y-2 text-sm">
                        <p className="text-muted-foreground"><strong>Cause:</strong> Network design issue - extremely long/steep runs.</p>
                        <div className="p-3 bg-card rounded">
                          <p className="font-semibold mb-1">Solutions:</p>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>Check for cascading lifts (multiple sawteeth in series)</li>
                            <li>Verify invert elevations are correct</li>
                            <li>Consider adding intermediate collection point</li>
                            <li>Reduce pipe length or increase diameter</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-secondary rounded-lg border border-border">
                      <h4 className="font-semibold mb-2">Field Mapping Checklist</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1" />
                          <div>
                            <p className="font-semibold">Link User Number 1 populated with flows (L/s)</p>
                            <p className="text-xs text-muted-foreground">Check: Link Grid → User Fields → User Number 1</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1" />
                          <div>
                            <p className="font-semibold">Vacuum station marked as Outfall</p>
                            <p className="text-xs text-muted-foreground">Check: Node Grid → Node Type = "Outfall"</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1" />
                          <div>
                            <p className="font-semibold">All pipes have roughness values</p>
                            <p className="text-xs text-muted-foreground">Check: Link Grid → Roughness (typically 100-140)</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1" />
                          <div>
                            <p className="font-semibold">Invert elevations are correct</p>
                            <p className="text-xs text-muted-foreground">Check: Link Grid → US Invert & DS Invert</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="examples" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Example ICM Network Results
                  </CardTitle>
                  <CardDescription>Before and after running the EPA vacuum script</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      These examples show typical ICM networks with User Number 9 field displaying vacuum head requirements after script execution.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-6">
                    <div className="p-4 bg-secondary rounded-lg">
                      <h4 className="font-semibold mb-3">Example 1: Successful Network (75 Homes)</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Badge variant="outline">Before Script</Badge>
                          <div className="p-4 bg-card rounded border border-border">
                            <p className="text-sm font-mono mb-2">Node Grid View:</p>
                            <div className="text-xs font-mono space-y-1 text-muted-foreground">
                              <p>Node_ID | Type | User_9 | Invert</p>
                              <p>---------|------|--------|--------</p>
                              <p>STATION | Outfall | <span className="text-destructive">NULL</span> | 5.00</p>
                              <p>VP_001 | Manhole | <span className="text-destructive">NULL</span> | 5.30</p>
                              <p>VP_002 | Manhole | <span className="text-destructive">NULL</span> | 5.45</p>
                              <p>VP_003 | Manhole | <span className="text-destructive">NULL</span> | 5.60</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Badge variant="outline" className="bg-primary text-primary-foreground">After Script</Badge>
                          <div className="p-4 bg-card rounded border-2 border-primary">
                            <p className="text-sm font-mono mb-2">Node Grid View:</p>
                            <div className="text-xs font-mono space-y-1 text-muted-foreground">
                              <p>Node_ID | Type | User_9 | Status</p>
                              <p>---------|------|--------|--------</p>
                              <p>STATION | Outfall | <span className="text-primary font-bold">0.00</span> | ✓ Start</p>
                              <p>VP_001 | Manhole | <span className="text-primary font-bold">1.25</span> | ✓ Good</p>
                              <p>VP_002 | Manhole | <span className="text-primary font-bold">2.18</span> | ✓ Good</p>
                              <p>VP_003 | Manhole | <span className="text-primary font-bold">2.94</span> | ✓ Good</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-primary/10 rounded">
                        <p className="text-sm"><strong>Result:</strong> All nodes below 3.5m threshold. System will operate reliably.</p>
                      </div>
                    </div>

                    <div className="p-4 bg-secondary rounded-lg">
                      <h4 className="font-semibold mb-3">Example 2: Problem Network (150 Homes)</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Badge variant="outline">Before Script</Badge>
                          <div className="p-4 bg-card rounded border border-border">
                            <p className="text-sm font-mono mb-2">Node Grid View:</p>
                            <div className="text-xs font-mono space-y-1 text-muted-foreground">
                              <p>Node_ID | Type | User_9 | Invert</p>
                              <p>---------|------|--------|--------</p>
                              <p>STATION | Outfall | <span className="text-destructive">NULL</span> | 2.00</p>
                              <p>VP_010 | Manhole | <span className="text-destructive">NULL</span> | 2.50</p>
                              <p>VP_025 | Manhole | <span className="text-destructive">NULL</span> | 3.20</p>
                              <p>VP_042 | Manhole | <span className="text-destructive">NULL</span> | 4.10</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Badge variant="outline" className="bg-destructive text-destructive-foreground">After Script - Issues Found</Badge>
                          <div className="p-4 bg-card rounded border-2 border-destructive">
                            <p className="text-sm font-mono mb-2">Node Grid View:</p>
                            <div className="text-xs font-mono space-y-1 text-muted-foreground">
                              <p>Node_ID | Type | User_9 | Status</p>
                              <p>---------|------|--------|--------</p>
                              <p>STATION | Outfall | <span className="text-primary font-bold">0.00</span> | ✓ Start</p>
                              <p>VP_010 | Manhole | <span className="text-primary font-bold">1.85</span> | ✓ OK</p>
                              <p>VP_025 | Manhole | <span className="text-yellow-500 font-bold">3.42</span> | ⚠ Limit</p>
                              <p>VP_042 | Manhole | <span className="text-destructive font-bold">5.67</span> | ✗ FAIL</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-destructive/10 rounded border border-destructive">
                        <p className="text-sm mb-2"><strong>Problem:</strong> VP_042 exceeds 4.0m limit - valve will not open reliably.</p>
                        <p className="text-sm font-semibold">Recommended Actions:</p>
                        <ul className="text-sm list-disc list-inside mt-1 space-y-1">
                          <li>Add intermediate collection point between VP_025 and VP_042</li>
                          <li>Increase pipe diameter on long runs</li>
                          <li>Reduce sawtooth lift heights in profile</li>
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 bg-card rounded border border-border">
                      <h4 className="font-semibold mb-3">How to View Results in ICM</h4>
                      <ol className="space-y-2 text-sm list-decimal list-inside">
                        <li><strong>Open Node Grid:</strong> Network → Node Grid</li>
                        <li><strong>Add User Number 9 Column:</strong> Right-click header → Insert Column → User Number 9</li>
                        <li><strong>Sort by Value:</strong> Click User Number 9 header to sort descending (find highest values first)</li>
                        <li><strong>Color Code:</strong> Use thematic map to visualize:
                          <ul className="ml-6 mt-1 space-y-1 list-disc list-inside text-muted-foreground">
                            <li>Green: 0-3.0m (Good)</li>
                            <li>Yellow: 3.0-3.5m (Caution)</li>
                            <li>Red: {'>'}3.5m (Problem)</li>
                          </ul>
                        </li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interpretation" className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">How to Interpret Results</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  After running the script, examine <strong>User Number 9</strong> on your nodes. This represents 
                  the cumulative vacuum head required at each point in the system.
                </p>

                <div className="space-y-3">
                  <div className="p-4 bg-card rounded-lg border-l-4 border-l-primary">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">Green Zone: 0 - 3.0 meters</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Excellent operating range. The system should function reliably with good vacuum reserve.
                    </p>
                  </div>

                  <div className="p-4 bg-card rounded-lg border-l-4 border-l-yellow-500">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <h4 className="font-semibold">Yellow Zone: 3.0 - 3.5 meters</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Design limit. System will work but has minimal safety margin. Consider system optimization.
                    </p>
                  </div>

                  <div className="p-4 bg-card rounded-lg border-l-4 border-l-destructive">
                    <div className="flex items-center gap-3 mb-2">
                      <XCircle className="h-5 w-5 text-destructive" />
                      <h4 className="font-semibold">Red Zone: {'>'}4.0 meters</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Critical:</strong> This node is likely "vacuum starved." In a real system, the valve 
                      here would fail to open, or the system would waterlog.
                    </p>
                    <div className="mt-3 p-3 bg-destructive/10 rounded">
                      <p className="text-xs font-semibold mb-1">Remediation Options:</p>
                      <ul className="text-xs space-y-1 list-disc list-inside">
                        <li>Reduce pipe length to this node</li>
                        <li>Increase pipe diameter</li>
                        <li>Add intermediate collection point</li>
                        <li>Redesign sawtooth profile to reduce cumulative lift</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="bg-secondary">
                <CardHeader>
                  <CardTitle className="text-base">Why Standard ICM Simulation Fails</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="p-3 bg-card rounded">
                    <p className="font-semibold mb-1">❌ Standard ICM Logic:</p>
                    <p className="text-muted-foreground">
                      A pipe that goes down 1 meter and then up 1 meter has a Net Static Head of 0 meters.
                    </p>
                  </div>
                  <div className="p-3 bg-card rounded">
                    <p className="font-semibold mb-1 text-primary">✓ EPA Sawtooth Logic (This Script):</p>
                    <p className="text-muted-foreground">
                      The same pipe has a Static Head of 1 meter because downhill gains are lost to airflow separation. 
                      This accurately reflects the energy cost of moving water slugs through vacuum lines.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="theory" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Historical Development of Vacuum Sewer Modeling
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-base mb-3">1. The Origins (1860s – 1950s)</h4>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-secondary rounded-lg">
                        <p className="font-semibold mb-1">Charles Liernur (1860s)</p>
                        <p className="text-muted-foreground">
                          Dutch engineer installed first pneumatic systems in Amsterdam and Prague. Systems were manually 
                          operated with vacuum tanks that would suck waste from latrines at scheduled times. Failed due to 
                          high cost and manual operation requirements.
                        </p>
                      </div>
                      <div className="p-3 bg-secondary rounded-lg">
                        <p className="font-semibold mb-1">Joel Liljendahl (1959)</p>
                        <p className="text-muted-foreground">
                          Swedish engineer invented the <strong>Vacuum Interface Valve</strong> - the breakthrough that 
                          enabled fully automatic operation. Electrolux bought the patents and began commercial production.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-base mb-3">2. The US Boom & Physics Problem (1970s)</h4>
                    <div className="space-y-3 text-sm">
                      <p className="text-muted-foreground">
                        Technology arrived in USA in 1969 (Airvac). Engineers installing systems in Florida and Virginia 
                        discovered they couldn't use standard hydraulic formulas (Manning's or Darcy-Weisbach).
                      </p>
                      <div className="p-4 bg-primary/10 rounded-lg border border-primary">
                        <p className="font-semibold mb-2">What is Slug Flow?</p>
                        <p className="text-muted-foreground">
                          A "cylinder" of water (sewage from one flush) traveling at 5 m/s, pushed by expanding air. 
                          Standard engineering math assumes steady streams. Vacuum sewers are violent, chaotic bursts. 
                          Friction includes the energy cost of accelerating slugs repeatedly.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-base mb-3">3. The Modeling Evolution</h4>
                    <div className="space-y-4 text-sm">
                      <div className="p-3 bg-secondary rounded-lg">
                        <p className="font-semibold mb-2">Phase 1: Empirical Era (1970s-1980s)</p>
                        <p className="text-muted-foreground mb-2">
                          Engineers built physical test loops and measured pressure loss. Developed the "Sawtooth" profile 
                          to prevent water slugs from merging. Used graphs and nomographs - no software.
                        </p>
                      </div>

                      <div className="p-3 bg-secondary rounded-lg">
                        <p className="font-semibold mb-2">Phase 2: EPA Manual (1991) - The Standard</p>
                        <p className="text-muted-foreground mb-2">
                          EPA published <strong>EPA 625/1-91/024</strong>: "Alternative Wastewater Collection Systems"
                        </p>
                        <div className="p-3 bg-card rounded mt-2">
                          <p className="font-semibold mb-1">The Breakthrough:</p>
                          <p className="text-muted-foreground">
                            You can use standard water formulas IF you treat "Sawtooth Lifts" (uphill bumps) as 
                            "equivalent length of pipe." A 0.3m lift = 12 meters of virtual pipe friction to account 
                            for slug reformation.
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-secondary rounded-lg">
                        <p className="font-semibold mb-2">Phase 3: Proprietary Era (2000s-Present)</p>
                        <p className="text-muted-foreground">
                          Vendors (Airvac, Flovac, Redivac) built internal software wrapping EPA 1991 math. Don't use 
                          SWMM/ICM because those solve St. Venant Equations (Open Channel Flow), which assume free water 
                          surface. Vacuum sewers are pressurized air systems.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-base mb-3">4. Why ICM Struggles</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="p-4 bg-card rounded border border-border">
                        <p className="font-semibold mb-2">What ICM Sees:</p>
                        <p className="text-muted-foreground">
                          A small amount of water trickling down a 150mm pipe
                        </p>
                        <p className="font-semibold mt-3 mb-2">ICM Concludes:</p>
                        <p className="text-muted-foreground">
                          "Low velocity, low friction, pipes will silt up"
                        </p>
                      </div>
                      <div className="p-4 bg-primary/10 rounded border-2 border-primary">
                        <p className="font-semibold mb-2">Reality:</p>
                        <p className="text-muted-foreground">
                          That water is being blasted by 400 cfm of air at 6 m/s, scouring the pipe clean
                        </p>
                        <p className="font-semibold mt-3 mb-2">Solution:</p>
                        <p className="text-muted-foreground">
                          Use ICM for hydrology, export flows to EPA method calculations
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-secondary">
                <CardHeader>
                  <CardTitle className="text-base">Industry Standard Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Most engineers follow this workflow:
                  </p>
                  <ol className="space-y-2 text-sm list-decimal list-inside">
                    <li>Build hydrology model in ICM/SWMM to get peak flows</li>
                    <li>Export flows to Excel using EPA method OR</li>
                    <li>Send to vendor (Airvac/Flovac) to run through proprietary software</li>
                    <li>Import results back for visualization</li>
                  </ol>
                  <div className="mt-4 p-3 bg-primary/10 rounded">
                    <p className="text-xs font-semibold">
                      This Ruby script automates Step 2-3, allowing you to stay inside ICM while using correct vacuum physics.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ICMIntegration;