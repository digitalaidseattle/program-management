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

const DEFAULT_SELECT = "*, venture(*)"
class StaffingService extends SupabaseEntityService<Staffing> {
    public constructor() {
        super("staffing");
    }

    getAll(count?: number, select?: string): Promise<Staffing[]> {
        return super.getAll(count, select ?? DEFAULT_SELECT);
    }

    findByVolunteerId(volunteerId: Identifier): Promise<Staffing[]> {
        return supabaseClient
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq('volunteer_id', volunteerId)
            .then((resp: any) => resp.data)
    }

    findByVentureId(ventureId: Identifier): Promise<Staffing[]> {
        return supabaseClient
            .from(this.tableName)
            .select("*, volunteer(*, profile(*)), role(*)")
            .eq('venture_id', ventureId)
            .then((resp: any) => resp.data)
    }
}

const staffingService = new StaffingService()
export { staffingService };
export type { Staffing };

