/**
 *  projectService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { FieldSet, Record } from "airtable";
import { dasAirtableService } from "./airtableService";
import { PageInfo, QueryModel } from "./supabaseClient";

const VOLUNTEER_TABLE = 'tblqGbhGVH6v36xwA';

const MAX_RECORDS = 200;
const FILTER = ``

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


class DASVolunteerService {

    transform(r: Record<FieldSet>): Volunteer {
        return {
            id: r.id,
            name: r.fields['Name'],
            firstName: r.fields['First name'],
            lastName: r.fields['Last name'],
            affliation: r.fields['Affiliation (from Volunteer Affiliation)'],
            status: r.fields['Venture Status'],
            ventures: r.fields['Prospective Ventures (from Squad Match Role)'],
            joinDate: r.fields['join date'],
            ventureDate: r.fields['Affiliation Start Date (from Volunteer Affiliation)'],
            ventureStatus: r.fields['Venture Status']
        } as Volunteer
    }

    async query(queryModel: QueryModel): Promise<PageInfo<Volunteer>> {
        // Airtable is lame: no table count
        // return dasAirtableService.query(VOLUNTEER_TABLE, queryModel)
        return dasAirtableService.getTableRecords(VOLUNTEER_TABLE, MAX_RECORDS, FILTER)
            .then(records => {
                const contributors = records
                    .map(r => this.transform(r))
                    .filter(v1 => v1.affliation ? v1.affliation.includes('Contributor') : false)
                const trimmed = contributors
                    .sort((v1, v2) => v1.lastName.localeCompare(v2.lastName))
                    .slice(queryModel.page, queryModel.page + queryModel.pageSize)
                console.log(queryModel, contributors)
                return {
                    totalRowCount: contributors.length,
                    rows: trimmed
                }
            })

    }

    getAll = async (): Promise<Volunteer[]> => {
        return dasAirtableService.getTableRecords(VOLUNTEER_TABLE, MAX_RECORDS, FILTER)
            .then(records => records.map(r => this.transform(r)));
    }

}

const dasVolunteerService = new DASVolunteerService()
export { dasVolunteerService };
export type { Volunteer };

