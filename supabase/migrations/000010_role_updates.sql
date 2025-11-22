ALTER TABLE
    role DROP column urgency;

ALTER TABLE
    role
ADD
    column urgency smallint;

ALTER TABLE
    role
ADD
    column pic text;

ALTER TABLE
    role
ADD
    column headline text;

ALTER TABLE
    role
ADD
    column location text;

ALTER TABLE
    role
ADD
    column responsibilities text;

ALTER TABLE
    role
ADD
    column qualifications text;

ALTER TABLE
    role
ADD
    column key_attributes text;

ALTER TABLE
    role
ADD
    column tags text [];