import { Profile } from "../services/dasProfileDao";
import { Team } from "../services/dasTeamDao";

export type Volunteer = Profile & {
    role: string,
    location: string,
    status: string,
    linkedin: string,
    join_date: Date,
    teams: Team[]
}