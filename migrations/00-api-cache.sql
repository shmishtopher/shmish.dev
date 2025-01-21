CREATE TABLE IF NOT EXISTS api_cache (
    uri TEXT PRIMARY KEY,
    response JSONB NOT NULL,
    cached_at TIMESTAMP NOT NULL
);
