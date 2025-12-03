ALTER TABLE
    venture_report DROP column IF EXISTS venture_id;

ALTER TABLE
    venture_report
ADD
    column venture_id UUID REFERENCES venture(id);

ALTER TABLE
    venture_report DROP CONSTRAINT IF EXISTS venture_report_venture_id_fkey;

ALTER TABLE
    venture_report
ADD
    CONSTRAINT venture_report_venture_id_fkey foreign KEY (venture_id) references venture (id) on delete CASCADE;