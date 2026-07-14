CREATE TABLE IF NOT EXISTS tutorials (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  language TEXT NOT NULL CHECK(language IN ('python', 'cpp', 'sql')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
  duration_ms INTEGER,
  event_log TEXT,             -- entire recorded event array as one JSON string
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS checkpoints (
  id TEXT PRIMARY KEY,
  tutorial_id TEXT NOT NULL,
  timestamp_ms INTEGER NOT NULL,        -- where in the recording this triggers; also the sort key
  title TEXT NOT NULL,
  objective TEXT NOT NULL,
  correct_output_delta TEXT NOT NULL,   -- ONLY the new output expected after this checkpoint
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tutorial_id) REFERENCES tutorials(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_checkpoints_tutorial ON checkpoints(tutorial_id, timestamp_ms);
