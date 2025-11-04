DROP TABLE IF EXISTS okr;

create table public.okr (
    id uuid not null,
    team_id uuid null,
    airtable_id text,
    title text null,
    description text null,
    start_date date null,
    end_date date null,
    health_rating integer null default 0,
    constraint okr_pkey primary key (id),
    constraint okr_team_id_fkey foreign KEY (team_id) references team (id) on delete CASCADE
);

DROP TABLE IF EXISTS forecast;

create table public.forecast (
    id uuid not null,
    team_id uuid null,
    airtable_id text,
    title text null,
    description text null,
    status text null,
    performance integer null default 0,
    start_date date null,
    end_date date null,
    constraint forecast_pkey primary key (id),
    constraint forecast_team_id_fkey foreign KEY (team_id) references team (id) on delete CASCADE
);