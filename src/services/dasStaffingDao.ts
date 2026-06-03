/**
 *  dasVentureService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { SupabaseConfiguration, SupabaseDAO } from "@digitalaidseattle/supabase";
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

const DEFAULT_SELECT = "*, volunteer(*, profile(*)), role(*), venture(*, partner(*)), team(*)"
class StaffingDao extends SupabaseDAO<Staffing> {

    private static _instance: StaffingDao;

    static getInstance(): StaffingDao {
        if (!this._instance) {
            this._instance = new StaffingDao();
        }
        return this._instance;
    }

    public constructor() {
        super(SupabaseConfiguration.getInstance().getSupabaseClient(), "staffing", { select: DEFAULT_SELECT });
    }

    async findByVolunteerId(volunteerId: Identifier): Promise<Staffing[]> {
        return this.client
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq('volunteer_id', volunteerId)
            .then((resp: any) => resp.data as Staffing[])
    }

    async findByVentureId(ventureId: Identifier): Promise<Staffing[]> {
        return this.client
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq('venture_id', ventureId)
            .then((resp: any) => resp.data as Staffing[]);
    }
}

export { StaffingDao };
export type { Staffing };

