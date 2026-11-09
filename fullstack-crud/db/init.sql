-- Single source of truth for the schema.
-- Both backends (Express + NestJS) read/write this same table.
CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  description TEXT         NOT NULL DEFAULT '',
  completed   BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

INSERT INTO tasks (title, description)
SELECT 'Learn system design', 'Read about load balancers, caching and DB indexing'
WHERE NOT EXISTS (SELECT 1 FROM tasks);
