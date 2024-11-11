CREATE TABLE
  members (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    birth_date TIMESTAMP WITH TIME ZONE NOT NULL,
    birth_place TEXT,
    card_number TEXT,
    country TEXT,
    doc_id TEXT,
    doc_type TEXT,
    email TEXT,
    expiration_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN,
    is_deleted BOOLEAN,
    measure TEXT,
    name TEXT,
    note TEXT,
    province TEXT,
    registration_date TIMESTAMP WITH TIME ZONE,
    surname TEXT,
    suspended_till TIMESTAMP WITH TIME ZONE,
    name_surname TEXT GENERATED ALWAYS AS (name || ' ' || surname) STORED
  );

CREATE INDEX idx_name_surname ON members USING GIN (to_tsvector('italian', name_surname));