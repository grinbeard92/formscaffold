-- Database initialization script
-- Generated from FormConfiguration for Reading List (Basic Form Example)

CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  isbn VARCHAR(13) NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(100) NOT NULL,
  genre VARCHAR(50) NOT NULL,
  publishedDate DATE NOT NULL,
  notes TEXT,
  rating INTEGER DEFAULT 0,
  progress INTEGER DEFAULT 0,
  read BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
CREATE UNIQUE INDEX IF NOT EXISTS uk_books_isbn ON books(isbn);
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_rating ON books(rating);
CREATE INDEX IF NOT EXISTS idx_books_progress ON books(progress);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_books_updated_at 
  BEFORE UPDATE ON books 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL PRIVILEGES ON TABLE books TO formscaffold_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO formscaffold_user;
