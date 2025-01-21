CREATE TABLE IF NOT EXISTS notes (
    path TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    dek TEXT NOT NULL,
    tag TEXT NOT NULL,
    content TEXT NOT NULL,
    read_time TEXT NOT NULL,
    date DATE NOT NULL,
    assets JSONB
);
