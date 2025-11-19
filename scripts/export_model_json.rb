require 'json'
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
run_export
