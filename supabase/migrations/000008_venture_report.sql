DROP TABLE IF EXISTS venture_report;

CREATE TYPE health_status AS ENUM ('on_track', 'at_risk', 'blocked');

CREATE TABLE venture_report (
    id UUID PRIMARY KEY,
    venture_id uuid REFERENCES venture(id),
    reported_by text NOT NULL,
    report_period date NOT NULL DEFAULT (date_trunc('month', now()))::date,
    health health_status NOT NULL,
    changes_by_partner text,
    successes text,
    challenges text,
    asks text,
    staffing_need text,
    next_steps text
);
