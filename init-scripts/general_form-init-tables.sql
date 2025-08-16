-- Database initialization script
-- Generated automatically from FormConfiguration

-- Drop existing table and related objects if they exist
DROP TABLE IF EXISTS general_form CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create the main table
CREATE TABLE general_form (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  field_technician_name VARCHAR(255) NOT NULL,
  equipment_type VARCHAR(255) NOT NULL,
  serial_number VARCHAR(255) NOT NULL,
  support_case_number VARCHAR(100) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  service_date TIMESTAMP NOT NULL,
  site_location TEXT NOT NULL,
  travel_time DECIMAL(4, 2) NOT NULL,
  mileage NUMERIC(10, 3),
  departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
  arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
  customer_contact VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  address VARCHAR(255) NOT NULL,
  customer_contact_name VARCHAR(255) NOT NULL,
  customer_contact_email VARCHAR(255) NOT NULL,
  confirm_system_performance BOOLEAN DEFAULT false,
  pre_service_ablation_performance VARCHAR(25) NOT NULL,
  pre_service_pulsing_power INTEGER NOT NULL,
  pre_service_cw_power INTEGER NOT NULL,
  replace_desiccant_packs BOOLEAN DEFAULT false,
  confirm_humidity_settings BOOLEAN DEFAULT false,
  capture_laser_settings BOOLEAN DEFAULT false,
  copy_logfiles BOOLEAN DEFAULT false,
  inspect_protection_window BOOLEAN DEFAULT false,
  clean_replace_optics BOOLEAN DEFAULT false,
  annual_water_service BOOLEAN DEFAULT false,
  confirm_o_rings_screws BOOLEAN DEFAULT false,
  tape_resonator_seams BOOLEAN DEFAULT false,
  inspect_protection_hose BOOLEAN DEFAULT false,
  update_mds_sensor BOOLEAN DEFAULT false,
  clean_equipment_dust BOOLEAN DEFAULT false,
  verify_air_pressure BOOLEAN DEFAULT false,
  verify_interlocks_estops BOOLEAN DEFAULT false,
  work_performed TEXT NOT NULL,
  parts_used TEXT,
  performance_test TEXT,
  issues_found TEXT,
  resolution_actions TEXT,
  followup_required VARCHAR(50) NOT NULL,
  followup_notes TEXT,
  before_service_photos VARCHAR(1000) NOT NULL,
  after_service_photos VARCHAR(1000) NOT NULL,
  customer_documents VARCHAR(1000),
  technician_signature TEXT NOT NULL,
  customer_signature TEXT NOT NULL,
  completion_date DATE NOT NULL,
  satisfaction_rating VARCHAR(10)
);

CREATE INDEX idx_general_form_equipment_type ON general_form(equipment_type);
CREATE INDEX idx_general_form_serial_number ON general_form(serial_number);
CREATE INDEX idx_general_form_support_case_number ON general_form(support_case_number);
CREATE INDEX idx_general_form_customer_name ON general_form(customer_name);
CREATE INDEX idx_general_form_pre_service_ablation_performance ON general_form(pre_service_ablation_performance);
CREATE INDEX idx_general_form_pre_service_pulsing_power ON general_form(pre_service_pulsing_power);
CREATE INDEX idx_general_form_pre_service_cw_power ON general_form(pre_service_cw_power);
CREATE INDEX idx_general_form_completion_date ON general_form(completion_date);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_general_form_updated_at
    BEFORE UPDATE ON general_form
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL PRIVILEGES ON TABLE general_form TO formscaffold_user;
GRANT USAGE, SELECT ON SEQUENCE general_form_id_seq TO formscaffold_user;
