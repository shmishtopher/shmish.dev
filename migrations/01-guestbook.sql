CREATE TABLE IF NOT EXISTS guestbook (
    timestamp TIMESTAMP NOT NULL,
    id BIGINT NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    text TEXT NOT NULL
);
