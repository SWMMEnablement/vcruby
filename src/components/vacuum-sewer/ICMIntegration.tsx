import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Code, Download, AlertCircle, CheckCircle2, AlertTriangle, XCircle, BookOpen, GitCompare, Wrench, ImageIcon, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NetworkSimulator from "./NetworkSimulator";
import { SawtoothVisualizer } from "./SawtoothVisualizer";
import { NetworkValidator } from "./NetworkValidator";
import icmRubyExample from "@/assets/icm-ruby-example.png";

interface ICMIntegrationProps {
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
}

const ICMIntegration = ({ activeSubTab = "usage", onSubTabChange }: ICMIntegrationProps) => {
  const [comparisonInputs, setComparisonInputs] = useState({
    pipeLength: 100,
    diameter: 150,
    flow: 2.5,
    usInvert: 10.0,
    dsInvert: 10.5,
    roughness: 120,
  });

  const [comparisonResults, setComparisonResults] = useState<any>(null);

  // Headloss Calculator State
  const [headlossInputs, setHeadlossInputs] = useState({
    flowLps: 5.0,
    diameterMm: 110,
    lengthM: 100.0,
    cFactor: 120,
  });

  const [headlossResults, setHeadlossResults] = useState<any>(null);

  const calculateHeadloss = () => {
    const { flowLps, diameterMm, lengthM, cFactor } = headlossInputs;
    
    // Convert units
    const qCms = flowLps / 1000.0;
    const dM = diameterMm / 1000.0;
    
    // Hazen-Williams Metric: h_f = 10.67 * L * (Q^1.852) / (C^1.852 * D^4.87)
    const headloss = 10.67 * lengthM * Math.pow(qCms, 1.852) / 
                     (Math.pow(cFactor, 1.852) * Math.pow(dM, 4.87));
    
    // Calculate velocity
    const area = Math.PI * Math.pow(dM / 2, 2);
    const velocity = qCms / area;
    
    setHeadlossResults({
      headloss: headloss.toFixed(4),
      velocity: velocity.toFixed(2),
      warning: velocity < 0.6 ? "⚠️ Velocity below 0.6 m/s - Risk of hydraulic lock!" : null
    });
  };

  const sawtoothScript = `# InfoWorks ICM Ruby Script: Vacuum Sewer Sawtooth Generator
# ---------------------------------------------------------
# This script splits a single selected link into a "Sawtooth" pattern
# consisting of alternating "Run" (Gravity/Slope) and "Lift" (Rising) segments.

# CONFIGURATION DEFAULTS
default_run_len = 50.0      # Length of the gravity section (m)
default_slope = 0.002       # Slope of the run (0.002 = 0.2%)
default_lift_height = 1.5   # Vertical rise of the lift (m)
default_lift_len = 2.0      # Horizontal length of the lift section (m)

# Get Current Network
net = WSApplication.current_network
if net.nil?
  puts "No network open."
  exit
end

# Get Selection (Must be exactly one conduit)
selection = net.row_objects_selection('hw_conduit')
if selection.size != 1
  WSApplication.message_box("Please select exactly one 'guide' conduit to convert into a sawtooth profile.", "Selection Error", "OK", nil)
  exit
end

original_link = selection[0]

# ---------------------------------------------------------
# INPUT DIALOG
# ---------------------------------------------------------
# Simple prompt to get parameters from the user
prompts = ["Run Length (m)", "Run Slope (decimal)", "Lift Height (m)", "Lift Length (m)"]
defaults = [default_run_len.to_s, default_slope.to_s, default_lift_height.to_s, default_lift_len.to_s]
input = WSApplication.prompt("Sawtooth Parameters", prompts, defaults)

if input.nil?
  puts "Operation cancelled."
  exit
end

p_run_len = input[0].to_f
p_slope = input[1].to_f
p_lift_h = input[2].to_f
p_lift_len = input[3].to_f

# ---------------------------------------------------------
# GEOMETRY CALCULATIONS
# ---------------------------------------------------------
# Get Start and End Nodes
us_node_id = original_link.us_node_id
ds_node_id = original_link.ds_node_id
us_node = net.row_object('hw_node', us_node_id)
ds_node = net.row_object('hw_node', ds_node_id)

# Start Z (Invert)
start_z = original_link.us_invert
if start_z.nil?
  start_z = us_node.chamber_floor
end

# Vector Math for the path
start_x = us_node.x
start_y = us_node.y
end_x = ds_node.x
end_y = ds_node.y

total_dx = end_x - start_x
total_dy = end_y - start_y
total_len = Math.sqrt(total_dx**2 + total_dy**2)

# Unit vectors
unit_x = total_dx / total_len
unit_y = total_dy / total_len

# Calculate number of segments
# One "Step" = Run + Lift
step_len = p_run_len + p_lift_len
num_steps = (total_len / step_len).floor

puts "Generating #{num_steps} sawtooth steps over #{total_len.round(2)}m..."

# ---------------------------------------------------------
# EXECUTION
# ---------------------------------------------------------
net.transaction_begin

begin
  current_x = start_x
  current_y = start_y
  current_z = start_z
  current_node_id = us_node_id
  
  # Base name for new nodes
  base_name = "ST_#{us_node_id}" 
  
  (1..num_steps).each do |i|
    
    # --- 1. CREATE RUN (Downhill) ---
    
    # Calculate coordinate at end of Run
    run_end_x = current_x + (unit_x * p_run_len)
    run_end_y = current_y + (unit_y * p_run_len)
    
    # Create Intermediate Node (Low Point)
    node_low_id = "#{base_name}_#{i}_L"
    node_low = net.new_object('hw_node')
    node_low.node_id = node_low_id
    node_low.x = run_end_x
    node_low.y = run_end_y
    node_low.ground_level = us_node.ground_level
    node_low.chamber_floor = current_z - (p_run_len * p_slope) - 2
    node_low.write
    
    # Create Conduit (Run)
    link_run = net.new_object('hw_conduit')
    link_run.us_node_id = current_node_id
    link_run.ds_node_id = node_low_id
    link_run.link_suffix = "1"
    link_run.link_type = "VSEW"
    link_run.shape = original_link.shape
    link_run.geom1 = original_link.geom1
    link_run.us_invert = current_z
    ds_inv_run = current_z - (p_run_len * p_slope)
    link_run.ds_invert = ds_inv_run
    link_run.write
    
    # Update current position
    current_x = run_end_x
    current_y = run_end_y
    current_z = ds_inv_run
    current_node_id = node_low_id

    # --- 2. CREATE LIFT (Uphill) ---
    
    is_last_step = (i == num_steps)
    
    if is_last_step && (total_len - (i * step_len)) < 5.0
       target_id = ds_node_id
       target_x = end_x
       target_y = end_y
    else
       target_id = "#{base_name}_#{i}_H"
       target_x = current_x + (unit_x * p_lift_len)
       target_y = current_y + (unit_y * p_lift_len)
       
       node_high = net.new_object('hw_node')
       node_high.node_id = target_id
       node_high.x = target_x
       node_high.y = target_y
       node_high.ground_level = us_node.ground_level
       node_high.write
    end

    # Create Conduit (Lift)
    link_lift = net.new_object('hw_conduit')
    link_lift.us_node_id = current_node_id
    link_lift.ds_node_id = target_id
    link_lift.link_suffix = "1"
    link_lift.link_type = "VLIFT"
    link_lift.shape = original_link.shape
    link_lift.geom1 = original_link.geom1
    link_lift.us_invert = current_z
    ds_inv_lift = current_z + p_lift_h
    link_lift.ds_invert = ds_inv_lift
    link_lift.write

    # Update current position for next loop
    current_x = target_x
    current_y = target_y
    current_z = ds_inv_lift
    current_node_id = target_id
    
  end
  
  # Connect last created node to original DS node if not already done
  if current_node_id != ds_node_id
    link_rem = net.new_object('hw_conduit')
    link_rem.us_node_id = current_node_id
    link_rem.ds_node_id = ds_node_id
    link_rem.link_suffix = "1"
    link_rem.shape = original_link.shape
    link_rem.geom1 = original_link.geom1
    link_rem.us_invert = current_z
    rem_dist = Math.sqrt((end_x - current_x)**2 + (end_y - current_y)**2)
    link_rem.ds_invert = current_z - (rem_dist * p_slope)
    link_rem.write
  end

  # Delete the original guide link
  original_link.delete

  net.transaction_commit
  puts "Success! Sawtooth pattern created."

rescue => e
  net.transaction_rollback
  puts "Error: #{e.message}"
  WSApplication.message_box("An error occurred: #{e.message}", "Script Error", "OK", nil)
end`;

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

  const jsonExportScript = `require 'json'
require 'date'

# ==============================================================================
# InfoWorks ICM: Model & Results to JSON Exporter
# ==============================================================================

def run_export
  # 1. Validation: Ensure a network is open
  net = WSApplication.current_network
  if net.nil?
    WSApplication.message_box("No network open. Please open a network (and simulation results if desired).", "Error", "OK", nil)
    return
  end

  # 2. Get file path from user
  file_path = WSApplication.file_dialog(false, 'json', 'JSON File', 'model_export', false, false)
  return if file_path.nil?

  # 3. Initialize Data Structure
  export_data = {
    meta: {
      generated_at: Time.now.to_s,
      user: ENV['USERNAME'],
      icm_version: WSApplication.version,
      network_name: net.model_object.name,
      scenario: net.current_scenario
    },
    timesteps: [],
    inputs: {},
    results: {}
  }

  # 4. Check if Simulation Results are loaded
  results_loaded = net.timestep_count > 0
  puts "Results detected: #{results_loaded}"
  
  if results_loaded
    # Export Timestep Definitions (DateTimes)
    # We iterate 0 to timestep_count-1 to get the actual times
    puts "Exporting timestep metadata..."
    (0...net.timestep_count).each do |i|
      export_data[:timesteps] << net.timestep_time(i).to_s
    end
  end

  # 5. Iterate through all tables (Nodes, Links, Subcatchments, etc.)
  tables = net.tables
  total_tables = tables.length
  
  tables.each_with_index do |table_info, t_index|
    table_name = table_info.name
    
    # Skip internal/system tables usually not needed for JSON dump, or keep them if you want everything
    next if table_name.start_with?("hw_result") 

    puts "Processing Table [#{t_index+1}/#{total_tables}]: #{table_name}..."

    # Initialize array for this table in inputs
    export_data[:inputs][table_name] = []
    if results_loaded
      export_data[:results][table_name] = []
    end

    # Get all row objects for this table
    objects = net.row_objects(table_name)

    # --- Loop through Objects ---
    objects.each do |ro|
      obj_id = ro.id
      
      # --- A. Process Inputs ---
      input_row = { "id" => obj_id }
      
      # Iterate all input fields
      table_info.fields.each do |field|
        val = ro[field.name]
        # Clean value for JSON (handle Dates, etc)
        input_row[field.name] = clean_value(val) unless val.nil?
      end
      export_data[:inputs][table_name] << input_row

      # --- B. Process Results (Only if loaded) ---
      if results_loaded
        # Check if this table actually has result fields
        res_fields = table_info.results_fields
        
        if !res_fields.nil? && !res_fields.empty?
          result_row = { "id" => obj_id }
          has_data = false

          res_fields.each do |r_field|
            # Get full array of results (time profile)
            # Note: ro.results(field) returns array of values for all timesteps
            begin
              # Check if field has time varying results to avoid errors on static results
              if r_field.has_time_varying_results?
                 values = ro.results(r_field.name)
                 # Only add if not empty/nil
                 if values
                   result_row[r_field.name] = values
                   has_data = true
                 end
              else
                 # Scalar result (e.g. Max Flood Depth)
                 val = ro.result(r_field.name)
                 result_row[r_field.name] = val
                 has_data = true
              end
            rescue
              # Silently skip fields that fail to retrieve
            end
          end

          export_data[:results][table_name] << result_row if has_data
        end
      end
    end
  end

  # 6. Write to Disk
  puts "Serializing to JSON (this may take a moment)..."
  begin
    File.open(file_path, 'w') do |f|
      # Use pretty_generate for readability, use generate for smaller file size
      f.write(JSON.pretty_generate(export_data))
    end
    puts "Export Complete: #{file_path}"
    WSApplication.message_box("Export completed successfully.", "Success", "OK", nil)
  rescue => e
    WSApplication.message_box("Failed to write file: #{e.message}", "Error", "OK", nil)
  end
end

# Helper to ensure data is JSON compatible
def clean_value(val)
  return nil if val.nil?
  
  if val.is_a?(DateTime) || val.is_a?(Time)
    return val.to_s # Convert dates to ISO strings
  end
  
  if val.is_a?(Float)
    return val.round(5) # Optional: rounding to save space
  end

  return val
end

# Execution
run_export`;

  const downloadSawtoothScript = () => {
    const blob = new Blob([sawtoothScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sawtooth_generator.rb';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadJsonExportScript = () => {
    const blob = new Blob([jsonExportScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export_model_json.rb';
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

          <Tabs value={activeSubTab} onValueChange={onSubTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-12 mb-4">
              <TabsTrigger value="usage">How to Use</TabsTrigger>
              <TabsTrigger value="modeling">Modeling</TabsTrigger>
              <TabsTrigger value="script">Script</TabsTrigger>
              <TabsTrigger value="simulator">Simulator</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="troubleshooting">Troubleshoot</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="visualizer">Visualizer</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
              <TabsTrigger value="jsonexport">JSON Export</TabsTrigger>
              <TabsTrigger value="interpretation">Results</TabsTrigger>
              <TabsTrigger value="theory">Theory</TabsTrigger>
            </TabsList>

            <TabsContent value="usage" className="space-y-6">
              <div className="space-y-4">
                <div className="mb-6">
                  <img 
                    src={icmRubyExample} 
                    alt="ICM InfoWorks vacuum sewer network diagram example" 
                    className="w-full rounded-lg border border-border shadow-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Example: ICM InfoWorks vacuum sewer network visualization
                  </p>
                </div>
                
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

              {/* Sawtooth Pattern Generator */}
              <div className="flex items-center justify-between mb-4 mt-8">
                <div>
                  <h3 className="font-semibold text-lg">sawtooth_generator.rb</h3>
                  <p className="text-sm text-muted-foreground">Automatic Sawtooth Pattern Generator</p>
                </div>
                <Button onClick={downloadSawtoothScript} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Script
                </Button>
              </div>

              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This script automatically creates a sawtooth profile from a single "guide" pipe. 
                  It generates alternating <strong>Run</strong> (downward gravity) and <strong>Lift</strong> (upward rise) segments, 
                  ideal for modeling vacuum sewer hydraulics.
                </AlertDescription>
              </Alert>

              <div className="bg-muted rounded-lg p-4 overflow-x-auto mb-4">
                <pre className="text-xs font-mono">
                  <code>{sawtoothScript}</code>
                </pre>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">How to Use the Sawtooth Generator:</h4>
                <ol className="list-decimal list-inside space-y-3 text-sm">
                  <li>
                    <strong>Draw a guide pipe:</strong> Create a single conduit representing the path from start to destination (e.g., to vacuum station)
                  </li>
                  <li>
                    <strong>Set node elevations:</strong> Ensure the Upstream Node has correct Ground Level and Chamber Floor values
                  </li>
                  <li>
                    <strong>Select the conduit:</strong> The pipe should highlight in red when selected
                  </li>
                  <li>
                    <strong>Run the script:</strong> Drag the .rb file onto ICM or use Network → Run Ruby Script
                  </li>
                  <li>
                    <strong>Enter parameters:</strong>
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li><strong>Run Length:</strong> Length of gravity section (e.g., 50m)</li>
                      <li><strong>Run Slope:</strong> Gradient as decimal (e.g., 0.002 = 0.2%)</li>
                      <li><strong>Lift Height:</strong> Vertical rise at sawtooth (e.g., 1.5m)</li>
                      <li><strong>Lift Length:</strong> Horizontal distance of lift (e.g., 2m)</li>
                    </ul>
                  </li>
                </ol>

                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    The script will automatically create intermediate nodes, set inverts, and delete the original guide pipe. 
                    New pipes are labeled as <code>VSEW</code> (vacuum sewer runs) and <code>VLIFT</code> (vacuum lifts).
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="simulator" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-engineering-blue" />
                    Interactive Network Simulator
                  </CardTitle>
                  <CardDescription>
                    Visualize how vacuum head propagates upstream through your network in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This simulator implements the same EPA Sawtooth logic as the Ruby script. 
                      Watch how vacuum head accumulates from the station upstream, with color-coded warnings for critical zones.
                    </AlertDescription>
                  </Alert>

                  <NetworkSimulator />

                  <div className="mt-6 space-y-3">
                    <h4 className="font-semibold">How to Use:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Click <strong>Run Simulation</strong> to start the vacuum head calculation</li>
                      <li>Watch the animation as head values propagate from the Vacuum Station (blue) upstream</li>
                      <li>Click on any node to view/edit its properties and connected pipes</li>
                      <li>Modify pipe parameters (length, diameter, flow) and re-run to see the impact</li>
                      <li>Add new nodes with <strong>Add Node</strong> to expand your network</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
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

            <TabsContent value="visualizer" className="space-y-6">
              <SawtoothVisualizer />
            </TabsContent>

            <TabsContent value="validation" className="space-y-6">
              <NetworkValidator />
            </TabsContent>

            <TabsContent value="jsonexport" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Download className="h-5 w-5 text-engineering-blue" />
                        JSON Model Export
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Export complete ICM model and simulation results to JSON format
                      </CardDescription>
                    </div>
                    <Button onClick={downloadJsonExportScript} variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download Script
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This script exports all input data and simulation results. Note that full ICM models with results 
                      can generate very large JSON files (potentially gigabytes for complex networks with long simulations).
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-base mb-3">What Gets Exported</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-secondary rounded-lg space-y-2">
                          <p className="font-semibold">Input Data</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• All node properties (coordinates, elevations, etc.)</li>
                            <li>• All conduit properties (dimensions, materials, inverts)</li>
                            <li>• Subcatchments and their parameters</li>
                            <li>• All custom user fields</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-secondary rounded-lg space-y-2">
                          <p className="font-semibold">Results Data (if loaded)</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Time-varying results for all timesteps</li>
                            <li>• Node depths, flood volumes, velocities</li>
                            <li>• Link flows, velocities, depths</li>
                            <li>• Summary statistics (max/min values)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-base mb-3">How to Use</h4>
                      <ol className="space-y-3 text-sm">
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">1</span>
                          <span className="pt-0.5">
                            <strong>Open InfoWorks ICM</strong> and load your network (GeoPlan view)
                          </span>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">2</span>
                          <span className="pt-0.5">
                            <strong>(Optional)</strong> Load simulation results by dragging a results file onto the GeoPlan if you want to export results data
                          </span>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">3</span>
                          <span className="pt-0.5">
                            Go to <strong>Network → Run Ruby Script</strong> and select the downloaded script
                          </span>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">4</span>
                          <span className="pt-0.5">
                            Choose where to save the JSON file when prompted
                          </span>
                        </li>
                        <li className="flex gap-3">
                          <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">5</span>
                          <span className="pt-0.5">
                            Wait for the export to complete (may take several minutes for large models)
                          </span>
                        </li>
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-semibold text-base mb-3">JSON Structure</h4>
                      <div className="bg-muted p-4 rounded-lg font-mono text-xs overflow-x-auto">
                        <pre>{`{
  "meta": {
    "network_name": "My Sewer Model",
    "scenario": "Base",
    "generated_at": "2023-10-27 10:00:00",
    "icm_version": "..."
  },
  "timesteps": [
    "2023-01-01T00:00:00+00:00",
    "2023-01-01T00:15:00+00:00"
  ],
  "inputs": {
    "wn_node": [
      {
        "id": "Manhole_1",
        "x": 12345.67,
        "y": 98765.43,
        "ground_level": 45.5,
        "chamber_floor": 42.0
      }
    ],
    "wn_conduit": [ ... ]
  },
  "results": {
    "wn_node": [
      {
        "id": "Manhole_1",
        "flooddepth": [0.0, 0.0, 0.1, 0.5, 0.1, 0.0],
        "floodvolume": [0.0, 0.0, 10.5, 50.2, 10.5, 0.0]
      }
    ]
  }
}`}</pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-base mb-3">Performance Considerations</h4>
                      <div className="space-y-3">
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Large Models:</strong> The script loads all data into memory before writing. 
                            For models with &gt;10,000 elements and long simulations, Ruby may run out of memory.
                          </AlertDescription>
                        </Alert>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="p-3 bg-card rounded border border-border">
                            <p className="font-semibold mb-2">File Size Tips</p>
                            <ul className="space-y-1 text-muted-foreground">
                              <li>• Input-only exports are typically small (KB-MB)</li>
                              <li>• Results can add significant size (MB-GB)</li>
                              <li>• Modify script to use <code className="text-xs bg-muted px-1">JSON.generate</code> instead of <code className="text-xs bg-muted px-1">pretty_generate</code> for smaller files</li>
                            </ul>
                          </div>
                          <div className="p-3 bg-card rounded border border-border">
                            <p className="font-semibold mb-2">Export Strategy</p>
                            <ul className="space-y-1 text-muted-foreground">
                              <li>• Export inputs separately from results</li>
                              <li>• Use selective table filtering in script</li>
                              <li>• Consider exporting subsets of the network</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-base mb-3">Use Cases</h4>
                      <div className="grid md:grid-cols-3 gap-3 text-sm">
                        <div className="p-3 bg-secondary rounded-lg">
                          <p className="font-semibold mb-2">Data Integration</p>
                          <p className="text-muted-foreground">
                            Import ICM data into web applications, databases, or GIS systems
                          </p>
                        </div>
                        <div className="p-3 bg-secondary rounded-lg">
                          <p className="font-semibold mb-2">Custom Analysis</p>
                          <p className="text-muted-foreground">
                            Process results with Python, R, or other analytical tools
                          </p>
                        </div>
                        <div className="p-3 bg-secondary rounded-lg">
                          <p className="font-semibold mb-2">Backup & Archive</p>
                          <p className="text-muted-foreground">
                            Create human-readable backups of model configurations
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm">
                        <strong>Script Details:</strong> The script includes data sanitization to convert InfoWorks-specific 
                        objects (DateTimes, etc.) into JSON-compatible formats. All dates are converted to ISO strings and 
                        floating point numbers are rounded to 5 decimal places for reasonable precision and file size.
                      </p>
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

            <TabsContent value="modeling" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-engineering-blue" />
                    Modeling Vacuum Sewers in ICM InfoWorks
                  </CardTitle>
                  <CardDescription>
                    Understanding how ICM handles negative pressure systems using Force Mains and pressurised solution models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-6 bg-primary/10 border-primary">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>The Challenge:</strong> ICM InfoWorks is designed for gravity and positive pressure systems. 
                      We simulate vacuum sewers (negative pressure) by using specific conduit types and solution models.
                    </AlertDescription>
                  </Alert>

                  <Tabs defaultValue="abstraction" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="abstraction">Physics Abstraction</TabsTrigger>
                      <TabsTrigger value="geometry">Sawtooth Profile</TabsTrigger>
                      <TabsTrigger value="solution">Solution Model</TabsTrigger>
                    </TabsList>

                    <TabsContent value="abstraction" className="space-y-4">
                      <Card className="bg-secondary">
                        <CardHeader>
                          <CardTitle className="text-lg">The Conduit Type: "Force Main"</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">The Concept</h4>
                            <p className="text-sm text-muted-foreground">
                              In ICM InfoWorks, vacuum lines are modeled as <strong>Force Mains</strong>, not Gravity Pipes. 
                              Even though the pressure is negative relative to the atmosphere, the hydraulic principles 
                              (Bernoulli/Energy Grade Line) remain valid.
                            </p>
                          </div>

                          <div className="p-4 bg-card rounded-lg border border-border">
                            <h4 className="font-semibold mb-3">Key Settings</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-engineering-blue mt-0.5" />
                                <div>
                                  <span className="font-semibold">Conduit Type:</span> Force Main
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-engineering-blue mt-0.5" />
                                <div>
                                  <span className="font-semibold">Shape:</span> Circular
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-engineering-blue mt-0.5" />
                                <div>
                                  <span className="font-semibold">Roughness:</span> Use Hazen-Williams or Darcy-Weisbach
                                </div>
                              </div>
                            </div>
                          </div>

                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                              <strong>Two-Phase Flow Adjustment:</strong> You must account for Air + Water flow. 
                              Since ICM creates a single-phase hydraulic computation, we often artificially increase 
                              roughness to account for the air friction drag.
                            </AlertDescription>
                          </Alert>

                          <div className="mt-4">
                            <h4 className="font-semibold mb-3">Ruby Script: Set Conduit Type</h4>
                            <pre className="bg-card p-4 rounded-lg border border-border text-xs overflow-x-auto">
{`# Convert selected conduits to Force Mains for Vacuum
net = WSApplication.current_network
net.transaction_begin

net.row_objects('hw_conduit').each do |link|
  # Identify Vacuum lines by User Field or ID pattern
  if link.id =~ /VAC/
    link.conduit_type = 'Force Main'
    link.roughness_type = 'Hazen-Williams'
    link.bottom_roughness = 120  # Adjusted C-Factor
    link.write
  end
end

net.transaction_commit
puts "Vacuum conduits updated successfully"`}</pre>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="geometry" className="space-y-4">
                      <Card className="bg-secondary">
                        <CardHeader>
                          <CardTitle className="text-lg">The Sawtooth Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Vacuum sewers rely on a <strong>"sawtooth" profile</strong> (lift-run-lift) to prevent hydraulic lock. 
                              The profile creates discrete slug packets that prevent water from backing up.
                            </p>
                          </div>

                          <div className="p-4 bg-card rounded-lg border border-border">
                            <h4 className="font-semibold mb-3">Critical Requirements</h4>
                            <div className="space-y-3 text-sm">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                                <div>
                                  <span className="font-semibold">In ICM:</span> You must explicitly model these inverts. 
                                  Do not straight-line the pipe.
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-engineering-blue mt-0.5" />
                                <div>
                                  <span className="font-semibold">The "Lift":</span> A short, steep upstream pipe segment
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-engineering-blue mt-0.5" />
                                <div>
                                  <span className="font-semibold">The "Run":</span> A long, downward sloping section
                                </div>
                              </div>
                            </div>
                          </div>

                          <Alert className="bg-primary/10 border-primary">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                              <strong>Import Warning:</strong> Don't simplify GIS vertices too much during import! 
                              The sawtooth geometry is critical for accurate modeling. Preserve elevation changes.
                            </AlertDescription>
                          </Alert>

                          <div className="p-4 bg-card rounded-lg border border-border">
                            <h4 className="font-semibold mb-2">Typical Sawtooth Parameters</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                              <div>
                                <span className="text-muted-foreground">Run Length:</span>
                                <p className="font-semibold">40-60 m</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Run Slope:</span>
                                <p className="font-semibold">0.2% (0.002)</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Lift Height:</span>
                                <p className="font-semibold">0.3-1.5 m</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Lift Length:</span>
                                <p className="font-semibold">2-5 m</p>
                              </div>
                            </div>
                          </div>

                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => onSubTabChange?.("visualizer")}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Open Sawtooth Visualizer
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="solution" className="space-y-4">
                      <Card className="bg-secondary">
                        <CardHeader>
                          <CardTitle className="text-lg">The Solution Model: "Pressurised"</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Why Pressurised Mode?</h4>
                            <p className="text-sm text-muted-foreground">
                              Standard gravity pipes use the Preissmann slot to simulate surcharge. For vacuum systems, 
                              you must force the solver to treat the pipe as fully primed (full) to avoid the software 
                              attempting to model free-surface flow during low-flow periods.
                            </p>
                          </div>

                          <div className="p-4 bg-card rounded-lg border border-border">
                            <h4 className="font-semibold mb-3">Simulation Parameters</h4>
                            <div className="space-y-3 text-sm">
                              <div>
                                <span className="font-semibold">Solution Type:</span>
                                <p className="text-muted-foreground mt-1">
                                  <Badge variant="outline" className="bg-engineering-blue/10">Pressurised</Badge> or 
                                  <Badge variant="outline" className="bg-engineering-blue/10 ml-2">Pressure Pipe</Badge>
                                </p>
                              </div>
                              <div>
                                <span className="font-semibold">Inertia Terms:</span>
                                <p className="text-muted-foreground mt-1">
                                  Include (Important for rapid valve opening/closing transients)
                                </p>
                              </div>
                              <div>
                                <span className="font-semibold">Timestep:</span>
                                <p className="text-muted-foreground mt-1">
                                  Very small (1s or less) if modeling actual interface valve cycles
                                </p>
                              </div>
                            </div>
                          </div>

                          <Alert className="bg-yellow-500/10 border-yellow-500">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <AlertDescription className="text-sm">
                              <strong>Critical:</strong> Using gravity solution mode will cause instability in vacuum systems. 
                              The solver will attempt to model free-surface flow, which doesn't exist in a vacuum sewer.
                            </AlertDescription>
                          </Alert>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-card rounded-lg border border-green-500">
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                <h4 className="font-semibold">Correct Approach</h4>
                              </div>
                              <ul className="text-sm space-y-1 text-muted-foreground">
                                <li>✓ Force Main conduit type</li>
                                <li>✓ Pressurised solution</li>
                                <li>✓ Sawtooth geometry preserved</li>
                                <li>✓ Adjusted C-factor for air</li>
                              </ul>
                            </div>
                            <div className="p-4 bg-card rounded-lg border border-red-500">
                              <div className="flex items-center gap-2 mb-2">
                                <XCircle className="h-5 w-5 text-red-500" />
                                <h4 className="font-semibold">Common Mistakes</h4>
                              </div>
                              <ul className="text-sm space-y-1 text-muted-foreground">
                                <li>✗ Gravity pipe type</li>
                                <li>✗ Free-surface flow mode</li>
                                <li>✗ Straight-line elevation</li>
                                <li>✗ Standard roughness values</li>
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>

                  <Card className="mt-6 bg-primary/5 border-primary">
                    <CardHeader>
                      <CardTitle className="text-lg">Interactive: Vacuum Headloss Estimator</CardTitle>
                      <CardDescription>
                        Calculate headloss using Hazen-Williams formula adjusted for vacuum conditions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="flowLps">Flow (L/s)</Label>
                            <Input
                              id="flowLps"
                              type="number"
                              value={headlossInputs.flowLps}
                              onChange={(e) => setHeadlossInputs({ ...headlossInputs, flowLps: parseFloat(e.target.value) })}
                              step="0.1"
                              min="0.1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="diameter">Pipe Diameter (mm)</Label>
                            <select
                              id="diameter"
                              className="w-full h-10 px-3 rounded-md border border-input bg-background"
                              value={headlossInputs.diameterMm}
                              onChange={(e) => setHeadlossInputs({ ...headlossInputs, diameterMm: parseInt(e.target.value) })}
                            >
                              <option value="90">90 mm</option>
                              <option value="110">110 mm</option>
                              <option value="160">160 mm</option>
                              <option value="200">200 mm</option>
                              <option value="250">250 mm</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="length">Pipe Length (m)</Label>
                            <Input
                              id="length"
                              type="number"
                              value={headlossInputs.lengthM}
                              onChange={(e) => setHeadlossInputs({ ...headlossInputs, lengthM: parseFloat(e.target.value) })}
                              step="1"
                              min="1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cFactor">
                              Hazen-Williams C-Factor
                              <span className="text-xs text-muted-foreground ml-2">(Adjust for Air)</span>
                            </Label>
                            <Input
                              id="cFactor"
                              type="number"
                              value={headlossInputs.cFactor}
                              onChange={(e) => setHeadlossInputs({ ...headlossInputs, cFactor: parseInt(e.target.value) })}
                              step="1"
                              min="80"
                              max="150"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Range: 80-150 (Lower values account for air friction)
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button onClick={calculateHeadloss} className="w-full">
                        Calculate Headloss
                      </Button>

                      {headlossResults && (
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                          <div className="p-4 bg-secondary rounded-lg border border-border">
                            <p className="text-sm text-muted-foreground mb-1">Calculated Headloss</p>
                            <p className="text-2xl font-bold text-engineering-blue">
                              {headlossResults.headloss} m
                            </p>
                          </div>
                          <div className="p-4 bg-secondary rounded-lg border border-border">
                            <p className="text-sm text-muted-foreground mb-1">Flow Velocity</p>
                            <p className="text-2xl font-bold text-engineering-blue">
                              {headlossResults.velocity} m/s
                            </p>
                          </div>
                        </div>
                      )}

                      {headlossResults?.warning && (
                        <Alert className="bg-yellow-500/10 border-yellow-500">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <AlertDescription className="text-sm">
                            {headlossResults.warning}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="p-4 bg-card rounded-lg border border-border mt-4">
                        <p className="text-sm font-semibold mb-2">💡 Pro Tip:</p>
                        <p className="text-sm text-muted-foreground">
                          If velocity drops below 0.6 m/s, vacuum lines risk waterlogging (hydraulic lock). 
                          In vacuum systems, air-to-liquid ratio (ALR) increases friction, so use reduced C-factors (100-120) 
                          compared to standard water systems (130-150).
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Summary Checklist for Modeling</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                          <CheckCircle2 className="h-5 w-5 text-engineering-blue mt-0.5" />
                          <div>
                            <p className="font-semibold text-sm">Abstraction</p>
                            <p className="text-xs text-muted-foreground">
                              Model as "Negative Pressure" force mains with adjusted C-factors
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                          <CheckCircle2 className="h-5 w-5 text-engineering-blue mt-0.5" />
                          <div>
                            <p className="font-semibold text-sm">Geometry</p>
                            <p className="text-xs text-muted-foreground">
                              Import must respect the sawtooth profile - don't simplify GIS vertices
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                          <CheckCircle2 className="h-5 w-5 text-engineering-blue mt-0.5" />
                          <div>
                            <p className="font-semibold text-sm">Stability</p>
                            <p className="text-xs text-muted-foreground">
                              Use Pressurised solution model - prevent open-channel flow simulation
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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