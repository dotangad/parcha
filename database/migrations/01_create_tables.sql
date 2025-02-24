-- Create timestamp update function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Create table for User
CREATE TABLE users (
    id uuid PRIMARY KEY default gen_random_uuid(), -- Using SERIAL for auto-incrementing ID
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    google_id TEXT NOT NULL unique,
    picture TEXT NOT NULL
);

-- Create table for Document
CREATE TABLE documents (
    id uuid PRIMARY KEY default gen_random_uuid(), -- Using SERIAL for auto-incrementing ID
    user_id uuid NOT NULL REFERENCES users(id), -- Foreign key referencing users table
    extension VARCHAR(100) NOT NULL,
    content JSONB NOT NULL, -- Using JSONB for flexible content structure
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title TEXT -- Optional title
);

create trigger update_documents_timestamp
before update on documents
for each row
execute procedure update_timestamp();










