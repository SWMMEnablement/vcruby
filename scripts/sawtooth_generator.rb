# InfoWorks ICM Ruby Script: Vacuum Sewer Sawtooth Generator
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
end
