-- Database initialization script
-- Generated automatically from FormConfiguration

-- Drop existing table and related objects if they exist
DROP TABLE IF EXISTS inhouse_form CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create the main table
CREATE TABLE inhouse_form (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  service_technician VARCHAR(255) NOT NULL,
  equipment_type VARCHAR(255) NOT NULL,
  serial_number VARCHAR(255) NOT NULL,
  work_order_number VARCHAR(100) NOT NULL,
  service_type VARCHAR(50) NOT NULL,
  service_date DATE NOT NULL,
  customer_source VARCHAR(255),
  priority_level VARCHAR(20) NOT NULL,
  initial_condition VARCHAR(25) NOT NULL,
  initial_power_output DECIMAL(10, 2),
  diagnostic_tests BOOLEAN DEFAULT false,
  calibration_performed BOOLEAN DEFAULT false,
  software_update BOOLEAN DEFAULT false,
  hardware_repair BOOLEAN DEFAULT false,
  cleaning_maintenance BOOLEAN DEFAULT false,
  qc_testing BOOLEAN DEFAULT false,
  final_power_output DECIMAL(10, 2),
  final_condition VARCHAR(30) NOT NULL,
  service_hours DECIMAL(5, 2) NOT NULL,
  ready_for_shipment BOOLEAN DEFAULT false,
  work_description TEXT NOT NULL,
  parts_used TEXT,
  tools_equipment_used TEXT,
  test_results TEXT,
  issues_encountered TEXT,
  resolution_actions TEXT,
  followup_required TEXT,
  service_photos VARCHAR(2000) NOT NULL,
  test_documentation VARCHAR(1000),
  technician_signature TEXT NOT NULL,
  customer_signature TEXT
);

CREATE INDEX idx_inhouse_form_equipment_type ON inhouse_form(equipment_type);
CREATE INDEX idx_inhouse_form_serial_number ON inhouse_form(serial_number);
CREATE INDEX idx_inhouse_form_work_order_number ON inhouse_form(work_order_number);
CREATE INDEX idx_inhouse_form_service_type ON inhouse_form(service_type);
CREATE INDEX idx_inhouse_form_service_date ON inhouse_form(service_date);
CREATE INDEX idx_inhouse_form_initial_condition ON inhouse_form(initial_condition);
CREATE INDEX idx_inhouse_form_final_condition ON inhouse_form(final_condition);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_inhouse_form_updated_at
    BEFORE UPDATE ON inhouse_form
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL PRIVILEGES ON TABLE inhouse_form TO formscaffold_user;
GRANT USAGE, SELECT ON SEQUENCE inhouse_form_id_seq TO formscaffold_user;
