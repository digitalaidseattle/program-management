/**
 *  dasVolunteerService.ts
 *
 *  @copyright 20245Digital Aid Seattle
 *
 */

import { PageInfo, QueryModel, supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";
import { Profile } from "./dasProfileService";
import { Identifier } from "@digitalaidseattle/core";

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

    async find(queryModel?: QueryModel, select?: string, mapper?: (json: any) => Volunteer): Promise<PageInfo<Volunteer>> {
        if (queryModel) {
            return this.dofind(queryModel, select ?? DEFAULT_SELECT, mapper);
        } else {
            return this.getAll()
                .then(vols => {
                    return {
                        rows: vols, totalRowCount: vols.length
                    }
                })
        }
    }

    async dofind(queryModel: QueryModel, select?: string, mapper?: (json: any) => Volunteer): Promise<PageInfo<Volunteer>> {
        try {
            let sortField = queryModel.sortField
            const sortOperator = { ascending: queryModel.sortDirection === 'asc' } as any
            if (sortField.includes('.')) {
                const split = sortField.split('.');
                sortField = `${split[0]}(${split[1]})`;
            }

            let query: any = supabaseClient
                .from(this.tableName)
                .select(select ?? '*', { count: 'exact' })
                .range(queryModel.page * queryModel.pageSize, (queryModel.page + 1) * queryModel.pageSize - 1)
                .order(sortField, sortOperator);

            const filterModel = (queryModel as any).filterModel;
            if (filterModel && filterModel.items) {
                filterModel.items.forEach((filter: any) => {
                    const field = filter.field;
                    const operator = filter.operator;
                    const value = filter.value;
                    if (field && operator && value) {
                        switch (operator) {
                            case '=':
                            case 'equals':
                                query = query.eq(field, value)
                                break;
                            case '!=':
                            case 'doesNotEqual':
                                query = query.neq(field, value)
                                break;
                            case '>':
                                query = query.gt(field, value)
                                break;
                            case '<':
                                query = query.lt(field, value)
                                break;
                            case 'contains':
                                query = query.ilike(field, `%${value}%`)
                                break;
                            case 'startsWith':
                                query = query.ilike(field, `${value}%`)
                                break;
                            case 'endsWith':
                                query = query.ilike(field, `%${value}`)
                                break;
                        }
                    }
                })
            }



            return query.then((resp: any) => {
                return {
                    rows: mapper ? resp.data.map((json: any) => mapper(json)) : resp.data,
                    totalRowCount: resp.count,
                };
            })
        } catch (err) {
            console.error('Unexpected error:', err);
            throw err;
        }
    }
}

const volunteerService = new VolunteerService();
export { volunteerService };
export type { Volunteer };

