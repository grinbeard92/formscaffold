-- Database initialization script
-- Generated automatically from FormConfiguration

-- Drop existing table and related objects if they exist
DROP TABLE IF EXISTS final_quality_form CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create the main table
CREATE TABLE final_quality_form (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  inspector_name VARCHAR(255) NOT NULL,
  equipment_type VARCHAR(255) NOT NULL,
  serial_number VARCHAR(255) NOT NULL,
  support_case VARCHAR(255) NOT NULL,
  customer VARCHAR(255) NOT NULL,
  maintenance_date DATE NOT NULL,
  next_maintenance_date DATE NOT NULL,
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
  issues_found TEXT,
  corrective_actions TEXT,
  recommendations TEXT,
  parts_used JSONB,
  job_hours JSONB,
  maintenance_pictures VARCHAR(1000),
  supporting_documents VARCHAR(1000),
  technician_signature TEXT NOT NULL,
  customer_signature TEXT
);

CREATE INDEX idx_final_quality_form_equipment_type ON final_quality_form(equipment_type);
CREATE INDEX idx_final_quality_form_maintenance_date ON final_quality_form(maintenance_date);
CREATE INDEX idx_final_quality_form_next_maintenance_date ON final_quality_form(next_maintenance_date);
CREATE INDEX idx_final_quality_form_pre_service_ablation_performance ON final_quality_form(pre_service_ablation_performance);
CREATE INDEX idx_final_quality_form_pre_service_pulsing_power ON final_quality_form(pre_service_pulsing_power);
CREATE INDEX idx_final_quality_form_pre_service_cw_power ON final_quality_form(pre_service_cw_power);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_final_quality_form_updated_at
    BEFORE UPDATE ON final_quality_form
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL PRIVILEGES ON TABLE final_quality_form TO formscaffold_user;
GRANT USAGE, SELECT ON SEQUENCE final_quality_form_id_seq TO formscaffold_user;
