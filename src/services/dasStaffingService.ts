/**
 *  dasVentureService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";
import { Venture } from "./dasVentureService";
import { Role } from "./dasRoleService";
import { Volunteer } from "./dasVolunteerService";
import { Team } from "./dasTeamService";
import { Identifier } from "@digitalaidseattle/core";

type Staffing = {
    id: string;
    airtable_id: string;
    venture_id: string;
    team_id: string;
    role_id: string;
    volunteer_id: string;
    status: string;
    timing: string;
    level: string;
    skills: string;
    importance: string;
    venture?: Venture;
    team?: Team;
    role?: Role;
    volunteer?: Volunteer;
}

const DEFAULT_SELECT = "*, volunteer(*, profile(*)), role(*), venture(*), team(*)"
class StaffingService extends SupabaseEntityService<Staffing> {
    STATUSES = [
        "Proposed",
        "Filled",
        "Please fill",
        "Maybe filled",
        "Cancelled",
        "Declined by Contributor"
    ]

    IMPORTANCES = [
        "Imperative",
        "Nice to have"
    ]

    TIMINGS = [
        "At the start",
        "1/3 into the Venture",
        "2/3 into the Venture"
    ]

    EXPERIENCE_LEVELS = [
        "Junior",
        "Mid",
        "Senior"
    ]

    public constructor() {
        super("staffing", DEFAULT_SELECT);
    }

    async findByVolunteerId(volunteerId: Identifier): Promise<Staffing[]> {
        return supabaseClient
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq('volunteer_id', volunteerId)
            .then((resp: any) => resp.data as Staffing[])
    }

    async findByVentureId(ventureId: Identifier): Promise<Staffing[]> {
        return supabaseClient
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq('venture_id', ventureId)
            .then((resp: any) => resp.data as Staffing[]);
    }
}

const staffingService = new StaffingService()
export { staffingService };
export type { Staffing };

