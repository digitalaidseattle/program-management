DROP TABLE IF EXISTS time_off;

CREATE TABLE time_off (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id uuid NOT NULL REFERENCES volunteer(id) ON DELETE CASCADE,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT time_off_end_after_start CHECK (end_at >= start_at)
);

CREATE INDEX time_off_volunteer_id_idx
  ON time_off (volunteer_id);
