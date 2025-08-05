-- Database initialization script
-- Generated automatically from FormConfiguration

-- Drop existing table and related objects if they exist
DROP TABLE IF EXISTS books CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create the main table
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  isbn VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(100) NOT NULL,
  genre VARCHAR(50) NOT NULL,
  date_read DATE,
  date_published DATE NOT NULL,
  notes TEXT,
  rating INTEGER DEFAULT 0,
  progress INTEGER DEFAULT 0,
  read BOOLEAN DEFAULT false
);

CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_rating ON books(rating);
CREATE INDEX idx_books_progress ON books(progress);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_books_updated_at
    BEFORE UPDATE ON books
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL PRIVILEGES ON TABLE books TO formscaffold_user;
GRANT USAGE, SELECT ON SEQUENCE books_id_seq TO formscaffold_user;
