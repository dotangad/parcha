CREATE EXTENSION IF NOT EXISTS btree_gist; -- Required for exclusion constraints

CREATE TABLE edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document1 UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    document2 UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    parent BOOLEAN DEFAULT FALSE,  -- Indicates if this is a parent-child relationship
    metadata JSONB,  -- Stores additional information about the relationship
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_bidirectional EXCLUDE USING GIST (
      LEAST(document1, document2) WITH =,
      GREATEST(document1, document2) WITH =
    )
);

create trigger update_edges_timestamp
before update on edges
for each row
-- update_timestamp is defined in 01_create_tables.sql
execute procedure update_timestamp();