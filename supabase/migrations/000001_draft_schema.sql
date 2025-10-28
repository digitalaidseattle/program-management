DROP TABLE IF EXISTS partner;

CREATE TABLE partner (
    id UUID PRIMARY KEY,
    airtable_id text,
    name text NOT NULL,
    type text NOT NULL,
    shorthand_name text,
    status text,
    description text,
    gdrive_link text,
    hubspot_link text,
    miro_link text,
    overview_link text,
    logo_url text,
    internal_champion text [],
    website text,
    foci text [],
    ally_utility text,
    general_phone text,
    internal_thoughts text
);

DROP TABLE IF EXISTS profile;

CREATE TABLE profile (
    id UUID PRIMARY KEY,
    name text NOT NULL,
    first_name text,
    last_name text,
    email text,
    phone text,
    location text,
    pic text
);

DROP TABLE IF EXISTS volunteer;

CREATE TABLE volunteer (
    id UUID PRIMARY KEY,
    profile_id UUID REFERENCES profile(id),
    airtable_id text,
    status text,
    affliation text,
    join_date Date,
    position text,
    disciplines text [],
    tool_ids text [],
    github text,
    das_email text,
    slack_id text,
    hope_to_give text,
    hope_to_get text,
    communication_preferences text,
    linkedin text
);

DROP TABLE IF EXISTS team;

CREATE TABLE team (
    id UUID PRIMARY KEY,
    airtable_id text,
    team text,
    volunteer_ids text [],
    welcome_message text,
    okrs text,
    forecast_ids text [],
    purpose text,
    status text,
    leader_ids text [],
    tool_ids text [],
    decision_making text,
    not_included text,
    knowledge_management text,
    new_to_the_team text,
    slack_channel text
);

DROP TABLE IF EXISTS team2volunteer;

CREATE TABLE team2volunteer (
    team_id uuid not null,
    volunteer_id uuid not null,
    leader boolean null default false,
    constraint team2volunteer_pkey primary key (team_id, volunteer_id),
    constraint team2volunteer_team_id_fkey foreign KEY (team_id) references team (id),
    constraint team2volunteer_volunteer_id_fkey foreign KEY (volunteer_id) references volunteer (id)
);

DROP TABLE IF EXISTS venture;

CREATE TABLE venture (
    id UUID PRIMARY KEY,
    airtable_id text,
    partner_id uuid REFERENCES partner(id),
    title text,
    painpoint text,
    status text,
    problem text,
    solution text,
    impact text,
    program_areas text,
    venture_code text,
    partner_airtable_id text []
);

DROP TABLE IF EXISTS tool;

CREATE TABLE tool (
    id UUID PRIMARY KEY,
    airtable_id text,
    name text,
    experts text [],
    status text,
    overview text,
    logo text,
    description text,
    teams text [],
    admins text []
);

DROP TABLE IF EXISTS discipline;

CREATE TABLE discipline (
    id UUID PRIMARY KEY,
    airtable_id text,
    name text,
    volunteer_ids text [],
    details text,
    senior_ids text [],
    slack text,
    status text
);

DROP TABLE IF EXISTS volunteer2discipline;

CREATE TABLE volunteer2discipline (
    volunteer_id uuid not null,
    discipline_id uuid not null,
    senior boolean,
    constraint volunteer2discipline_pkey primary key (volunteer_id, discipline_id),
    constraint volunteer2discipline_discipline_id_fkey foreign KEY (discipline_id) references discipline (id),
    constraint volunteer2discipline_volunteer_id_fkey foreign KEY (volunteer_id) references volunteer (id)
);

DROP TABLE IF EXISTS volunteer2tool;

CREATE TABLE volunteer2tool (
    volunteer_id uuid not null,
    tool_id uuid not null,
    expert boolean,
    constraint volunteer2tool_pkey primary key (volunteer_id, tool_id),
    constraint volunteer2tool_tool_id_fkey foreign KEY (tool_id) references tool (id),
    constraint volunteer2tool_volunteer_id_fkey foreign KEY (volunteer_id) references volunteer (id)
);

DROP TABLE IF EXISTS role;

CREATE TABLE role (
    id UUID PRIMARY KEY,
    airtable_id text,
    name text NOT NULL,
    description text
);

DROP TABLE IF EXISTS staffing;

CREATE TABLE staffing (
    id UUID PRIMARY KEY,
    airtable_id text,
    venture_id uuid REFERENCES venture(id),
    team_id uuid REFERENCES team(id),
    role_id uuid REFERENCES role(id),
    volunteer_id uuid REFERENCES volunteer(id),
    status text,
    timing text,
    level text,
    skills text,
    importance text
);

DROP TABLE IF EXISTS team2tool;

CREATE TABLE team2tool (
    team_id uuid not null,
    tool_id uuid not null,
    constraint team2tool_pkey primary key (team_id, tool_id),
    constraint team2tool_team_id_fkey foreign KEY (team_id) references team (id),
    constraint team2tool_tool_id_fkey foreign KEY (tool_id) references tool (id)
);

CREATE TABLE venture_report (
    id UUID PRIMARY KEY,
    venture_id uuid REFERENCES venture(id),
    reported_by text,
    changes_by_partner text,
    successes text,
    staffing_need text,
    staffing_issues text
);

DROP TABLE IF EXISTS meeting;

CREATE TABLE meeting (
    id UUID PRIMARY KEY,
    name text,
    type text,
    date Date,
    meeting_url text,
    status text,
    notes text
);

DROP TABLE IF EXISTS meeting_attendee;

CREATE TABLE meeting_attendee (
    id UUID PRIMARY KEY,
    meeting_id uuid REFERENCES meeting(id),
    profile_id uuid REFERENCES profile(id),
    present boolean,
    email text,
    constraint meeting_attendee_pkey primary key (id),
    constraint meeting_attendee_meeting_id_fkey foreign KEY (meeting_id) references meeting (id) on delete CASCADE,
    constraint meeting_attendee_profile_id_fkey foreign KEY (profile_id) references profile (id) on delete CASCADE,
);

DROP TABLE IF EXISTS meeting_topic;

CREATE TABLE meeting_topic (
    id UUID PRIMARY KEY,
    meeting_id uuid REFERENCES meeting(id),
    type text,
    title text,
    description text,
    created_by text,
    discussed boolean,
    constraint meeting_topic_pkey primary key (id),
    constraint meeting_topic_meeting_id_fkey foreign KEY (meeting_id) references meeting (id) on delete CASCADE
);