# ==============================================================================
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
puts "WARNING: If User Number 9 > 3.5m, system may fail."
