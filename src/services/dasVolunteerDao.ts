/**
 *  dasVolunteerService.ts
 *
 *  @copyright 20245Digital Aid Seattle
 *
 */
import { SupabaseConfiguration, SupabaseDAO } from "@digitalaidseattle/supabase";
import { v4 as uuid } from 'uuid';
import { Profile } from "./dasProfileService";

type VolunteerStatusType =
    "Cadre" |
    "new prospect" |
    "past" |
    "taking a break" |
    "on call" |
    "rejected" |
    "Offboarding Cadre" |
    "Onboarding" |
    "Board only" |
    "Contributor" |
    "Offboarding Contributor";


type Volunteer = {
    id: string,
    profile_id: string,
    airtable_id: string,
    affliation: string,
    status: VolunteerStatusType,
    join_date: Date,
    position: string,
    disciplines: string[],
    tool_ids: string[],
    github: string,
    das_email: string,
    slack_id: string,
    hope_to_give: string,
    hope_to_get: string,
    communication_preferences: string,
    linkedin: string,
    profile?: Profile,
}

const DEFAULT_SELECT = '*, profile!inner(*)';
class VolunteerDao extends SupabaseDAO<Volunteer> {
    private static instance: VolunteerDao;

    public static getInstance(): VolunteerDao {
        if (!VolunteerDao.instance) {
            this.instance = new VolunteerDao();
        }
        return VolunteerDao.instance;
    }

    empty(profile: Profile): Volunteer {
        return ({
            id: uuid(),
            profile_id: profile.id,
            airtable_id: "",
            affliation: "",
            status: "Contributor",
            join_date: new Date(),
            position: "",
            disciplines: [],
            tool_ids: [],
            github: "",
            das_email: "",
            slack_id: "",
            hope_to_give: "",
            hope_to_get: "",
            communication_preferences: "",
            linkedin: "",
            profile: profile,
        });
    }

    private constructor() {
        super(
            SupabaseConfiguration.getInstance().getSupabaseClient(),
            "volunteer",
            { select: DEFAULT_SELECT }
        )
    }

    async getActive(): Promise<Volunteer[]> {
        return this.client
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .in('status', ['Cadre', 'Contributor'])
            .then((resp: any) => resp.data);
    }

    async findCadreVolunteers(): Promise<Volunteer[]> {
        return this.client
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .in('status', ['Cadre'])
            .then((resp: any) => resp.data);
    }

    async findByAirtableId(airtableId: string): Promise<Volunteer> {
        return await this.client
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq('airtable_id', airtableId)
            .single()
            .then((resp: any) => resp.data);
    }

    async findByDasEmail(email: string): Promise<Volunteer> {
        return await this.client
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .ilike('das_email', email)
            .single()
            .then((resp: any) => resp.data);
    }
}

export { VolunteerDao };
export type { Volunteer };

