-- 1. Enable AI Vector Search
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Daily Log
CREATE TABLE daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id), -- Nullable for now
    date DATE NOT NULL,
    entry_type VARCHAR(50) NOT NULL,
    mood VARCHAR(50),
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Knowledge Bank
CREATE TABLE knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    source_url TEXT,
    content TEXT,
    media_type VARCHAR(50),
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. The Vault
CREATE TABLE vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    category VARCHAR(50),
    expiry_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. AI Embeddings
CREATE TABLE embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_id UUID NOT NULL,
    reference_type VARCHAR(50),
    vector VECTOR(1536),
    created_at TIMESTAMPTZ DEFAULT NOW()
);-- Add migration script here
