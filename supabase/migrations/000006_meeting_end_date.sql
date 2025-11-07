ALTER TABLE
    meeting DROP COLUMN IF EXISTS date;

ALTER TABLE
    meeting
ADD
    COLUMN start_date timestamptz;

ALTER TABLE
    meeting
ADD
    COLUMN end_date timestamptz;

ALTER TABLE
    meeting_topic DROP CONSTRAINT IF EXISTS meeting_topic_meeting_id_fkey;

ALTER TABLE
    meeting_topic
ADD
    CONSTRAINT meeting_topic_meeting_id_fkey foreign KEY (meeting_id) references meeting (id) on delete CASCADE;