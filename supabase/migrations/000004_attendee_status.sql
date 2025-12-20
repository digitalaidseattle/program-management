ALTER TABLE meeting_attendee DROP COLUMN IF EXISTS present;
ALTER TABLE meeting_attendee ADD COLUMN status text;