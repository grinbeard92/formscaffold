-- Database initialization script
-- Generated automatically from FormConfiguration

-- Drop existing table and related objects if they exist
DROP TABLE IF EXISTS demo CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create the main table
CREATE TABLE demo (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  website VARCHAR(500),
  phone VARCHAR(20),
  keywords TEXT,
  secret_code VARCHAR(255),
  age INTEGER NOT NULL,
  salary DECIMAL(10, 2),
  experience_level INTEGER DEFAULT 5,
  satisfaction INTEGER DEFAULT 50,
  birth_date DATE,
  appointment_time TIME,
  event_datetime TIMESTAMP,
  target_month VARCHAR(7),
  target_week VARCHAR(8),
  language VARCHAR(5) NOT NULL,
  skill_level VARCHAR(20) NOT NULL,
  newsletter_subscription BOOLEAN DEFAULT false,
  notifications_enabled BOOLEAN DEFAULT true,
  favorite_color VARCHAR(7),
  profile_picture BYTEA,
  resume_file VARCHAR(500),
  biography TEXT,
  config_json JSONB,
  skills TEXT,
  user_id UUID DEFAULT gen_random_uuid(),
  metadata JSONB
);

CREATE INDEX idx_demo_full_name ON demo(full_name);
CREATE INDEX idx_demo_email ON demo(email);
CREATE INDEX idx_demo_age ON demo(age);
CREATE INDEX idx_demo_birth_date ON demo(birth_date);
CREATE INDEX idx_demo_language ON demo(language);
CREATE INDEX idx_demo_skill_level ON demo(skill_level);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_demo_updated_at
    BEFORE UPDATE ON demo
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL PRIVILEGES ON TABLE demo TO formscaffold_user;
GRANT USAGE, SELECT ON SEQUENCE demo_id_seq TO formscaffold_user;
