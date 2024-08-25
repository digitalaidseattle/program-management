/**
 *  projectService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { FieldSet, Record } from "airtable";
import { dasAirtableService } from "./airtableService";

const STAFFING_TABLE = 'tbllAEHFTFX5IZDZL';

type StaffingNeed = {
    id: string,
    status: string,
    importance: string,
    timing: string,
    ventureIds: string[],
    roles: string[],
    volunteerAssigned: string[]
}


class DASStaffingService {

    transform(r: Record<FieldSet>): StaffingNeed {
        console.log(r)
        return {
            id: r.id,
            status: r.fields['Status'],
            importance: r.fields['Importance'],
            timing: r.fields['Timing'],
            ventureIds: r.fields['Prospective Ventures'],
            roles: r.fields['Role in text for website'],
            volunteerAssigned: r.fields['Contributor in text for website']
        } as StaffingNeed
    }

    async findAll(project?: any): Promise<StaffingNeed[]> {
        // const FILTER = `OR(${taskGroup.taskIds.map((tid: any) => `'${tid}' = {UID}`).join(', ')})`;

        const filter = project
            ? `FIND('${project.ventureCode}', ARRAYJOIN({Prospective Ventures}))`
            : ''

        // const FILTER = `'${project.id}' = {Prospective Ventures}`;
        console.log('FILTER', filter)

        return dasAirtableService.getAll(STAFFING_TABLE, filter)
            .then(records => records.map(r => this.transform(r)))

    }

}

const dasStaffingService = new DASStaffingService();
export { dasStaffingService };
export type { StaffingNeed };

