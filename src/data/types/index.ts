import { Entity } from "@digitalaidseattle/core";

export const VENTURE_STATUSES: String[] = [
    "Submitted by Partner",
    "Ready for consideration",
    "Active",
    "Paused",
    "Declined",
    "Delivered"
];

export type Venture = Entity & {
    airtable_id: string
    coda_id?: string;
    partner_id: string | null;
    title: string;
    painpoint: string;
    status: string;
    problem: string;
    solution: string;
    impact: string;
    program_areas: string[];
    venture_code: string;
    partner_airtable_id: string[],
    icon: string;
    partner_name: string;
    // partner?: Partner;
}

export type Profile = {
    id: string;
    name: string,
    first_name: string,
    last_name: string,
    email: string,
    phone: string,
    location: string,
    pic: string
}
// FIXME use enum
// export type VolunteerStatusType =
//     "Active" |
//     "Past" |
//     "Taking a break" |
//     "Onboarding" |
//     "Offboarding";

export const VolunteerStatusTypes: string[] = [
    'Active',
    'Past',
    'Taking a break',
    'Onboarding',
    'Offboarding'
];

export type Volunteer = Profile & {
    role: string,
    roles: string[],  // Cadre, Contributor, Director
    status: string,
    linkedin: string,
    join_date: Date,
    position: string;
    disciplines: string[];
    tool_ids: string[];
    github: string;
    das_email: string;
    slack_id: string;
    hope_to_give: string;
    hope_to_get: string;
    communication_preferences: string;
    team_lead?: Team[];
    teams?: Team[];
}

export type Forecast = {

}

export type Team = Entity & {
    name: string;
    airtable_id: string;
    volunteer_ids: string[];  // Deprecated: use Team2Volunteer join table instead
    welcome_message: string;
    okrs: string;
    forecast_ids: string;  // Deprecated - airtable artifact
    purpose: string;
    status: string;
    leader_ids: string[];  // Deprecated - airtable artifact
    tool_ids: string[];  // Deprecated - airtable artifact
    decision_making: string;
    not_included: string;
    knowledge_management: string;
    new_to_the_team: string;
    slack_channel: string;
    volunteer?: Volunteer[];
    // okr?: OKR[];
    // forecast?: Forecast[];
    members: Volunteer[];
    leads: Volunteer[]
}