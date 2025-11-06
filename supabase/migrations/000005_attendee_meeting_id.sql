ALTER TABLE
    meeting_attendee
ADD
    COLUMN team_id uuid;

ALTER TABLE
    meeting_attendee
ADD
    CONSTRAINT meeting_attendee_team_id_fkey FOREIGN KEY (team_id) REFERENCES team (id);