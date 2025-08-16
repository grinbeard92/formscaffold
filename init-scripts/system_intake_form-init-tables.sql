-- Database initialization script
-- Generated automatically from FormConfiguration

-- Drop existing table and related objects if they exist
DROP TABLE IF EXISTS system_intake_form CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create the main table
CREATE TABLE system_intake_form (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  receiving_technician VARCHAR(255) NOT NULL,
  equipment_type VARCHAR(255) NOT NULL,
  serial_number VARCHAR(255) NOT NULL UNIQUE,
  equipment_source VARCHAR(50) NOT NULL,
  source_contact VARCHAR(255) NOT NULL,
  intake_date DATE NOT NULL,
  rma_case_number VARCHAR(100),
  transport_method VARCHAR(50) NOT NULL,
  physical_condition VARCHAR(25) NOT NULL,
  power_on_test VARCHAR(25) NOT NULL,
  laser_performance VARCHAR(25),
  power_output DECIMAL(10, 2),
  accessories_included BOOLEAN DEFAULT false,
  documentation_included BOOLEAN DEFAULT false,
  software_included BOOLEAN DEFAULT false,
  packaging_condition VARCHAR(25) NOT NULL,
  reported_issues TEXT,
  visual_inspection_notes TEXT,
  immediate_action_required TEXT,
  equipment_photos VARCHAR(2000) NOT NULL,
  supporting_documents VARCHAR(1000),
  technician_signature TEXT NOT NULL,
  supervisor_signature TEXT
);

CREATE INDEX idx_system_intake_form_equipment_type ON system_intake_form(equipment_type);
CREATE INDEX idx_system_intake_form_serial_number ON system_intake_form(serial_number);
CREATE INDEX idx_system_intake_form_equipment_source ON system_intake_form(equipment_source);
CREATE INDEX idx_system_intake_form_intake_date ON system_intake_form(intake_date);
CREATE INDEX idx_system_intake_form_physical_condition ON system_intake_form(physical_condition);
CREATE INDEX idx_system_intake_form_power_on_test ON system_intake_form(power_on_test);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_system_intake_form_updated_at
    BEFORE UPDATE ON system_intake_form
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL PRIVILEGES ON TABLE system_intake_form TO formscaffold_user;
GRANT USAGE, SELECT ON SEQUENCE system_intake_form_id_seq TO formscaffold_user;
