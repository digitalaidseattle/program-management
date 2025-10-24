/**
 *  dasVolunteerService.ts
 *
 *  @copyright 20245Digital Aid Seattle
 *
 */

import { Identifier } from "@digitalaidseattle/core";
import { PageInfo, QueryModel, supabaseClient } from "@digitalaidseattle/supabase";
import { Profile } from "./dasProfileService";
import { PMEntityService } from "./pmEntityService";

type AirtableVolunteer = {
    id: string,
    airtable_id: string,
    name: string,
    firstName: string,
    lastName: string,
    affliation: string,
    status: string,
    ventures: string,
    joinDate: string,
    ventureDate: string,
    ventureStatus: string,
    position: string,
    disciplines: string[],
    tools: string[],
    personalEmail: string,
    phone: string,
    pic: string,

    github: string,
    dasEmail: string,
    slackId: string,
    location: string,
    hopeToGive: string,
    hopeToGet: string,
    communicationPreferences: string,
    linkedin: string,

}

type Volunteer = {
    id: string,
    profile_id: string,
    airtable_id: string,
    affliation: string,
    status: "Cadre" |
    "new prospect" |
    "past" |
    "Cadre" |
    "taking a break" |
    "on call" |
    "rejected" |
    "Offboarding Cadre" |
    "Onboarding" |
    "Board only" |
    "Contributor" |
    "Offboarding Contributor",
    join_date: string,
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
    leader?: boolean
}

const DEFAULT_SELECT = '*, profile!inner(*)';
class VolunteerService extends SupabaseEntityService<Volunteer> {

    public constructor() {
        super("volunteer");
    }

    async getActive(): Promise<Volunteer[]> {
        return supabaseClient
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .in('status', ['Cadre', 'Contributor'])
            .then((resp: any) => resp.data);
    }

    async findCadreVolunteers(): Promise<Volunteer[]> {
        return supabaseClient
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .in('status', ['Cadre'])
            .then((resp: any) => resp.data);
    }

    async getById(id: Identifier): Promise<Volunteer | null> {
        return super.getById(id, DEFAULT_SELECT);
    }

    getAll(_count?: number, _select?: string): Promise<Volunteer[]> {
        return super.getAll(undefined, DEFAULT_SELECT);
    }

    async findByAirtableId(airtableId: string): Promise<AirtableVolunteer> {
        return await supabaseClient
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq('airtable_id', airtableId)
            .single()
            .then((resp: any) => resp.data);
    }

    async find(queryModel: QueryModel, select?: string, mapper?: (json: any) => Volunteer): Promise<PageInfo<Volunteer>> {
        return super.find(queryModel!, select ?? DEFAULT_SELECT, mapper);
    }

}

const volunteerService = new VolunteerService();
export { volunteerService };
export type { Volunteer };

