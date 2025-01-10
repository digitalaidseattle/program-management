/**
 *  dasVolunteerService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { FieldSet, Record } from "airtable";
import { dasAirtableClient } from "../../../services/airtableClient";
import { AirtableRecordService } from "../../../services/airtableRecordService";
import { PageInfo, QueryModel } from "@digitalaidseattle/supabase";

const VOLUNTEER_TABLE = 'tblqGbhGVH6v36xwA';


type Volunteer = {
    id: string,
    name: string,
    firstName: string,
    lastName: string,
    affliation: string,
    status: string,
    ventures: string,
    joinDate: string,
    ventureDate: string,
    ventureStatus: string,
}


class DASVolunteerService extends AirtableRecordService<Volunteer> {
    public constructor() {
        super(dasAirtableClient.base(import.meta.env.VITE_AIRTABLE_BASE_ID_DAS), VOLUNTEER_TABLE);
    }
    airtableTransform(r: Record<FieldSet>): Volunteer {
        return {
            id: r.id,
            name: r.fields['Name'],
            firstName: r.fields['First name'],
            lastName: r.fields['Last name'],
            affliation: r.fields['Affiliation (from Volunteer Affiliation)'],
            status: r.fields['Manual Status'],
            ventures: r.fields['Prospective Ventures (from Squad Match Role)'],
            joinDate: r.fields['join date'],
            ventureDate: r.fields['Affiliation Start Date (from Volunteer Affiliation)'],
            ventureStatus: r.fields['Venture Status']
        } as Volunteer
    }

    async findConstributors(queryModel: QueryModel): Promise<PageInfo<Volunteer>> {
        // Airtable is lame: no table count
        // return dasAirtableService.query(VOLUNTEER_TABLE, queryModel)
        return super.findAll()
            .then(volunteers => {
                const contributors = volunteers
                    .filter(v1 => v1.affliation ? v1.affliation.includes('Contributor') : false)
                const trimmed = contributors
                    .sort((v1, v2) => v1.lastName.localeCompare(v2.lastName))
                    .slice(queryModel.page, queryModel.page + queryModel.pageSize)
                return {
                    totalRowCount: contributors.length,
                    rows: trimmed
                }
            })

    }

}

const dasVolunteerService = new DASVolunteerService()
export { dasVolunteerService };
export type { Volunteer };

