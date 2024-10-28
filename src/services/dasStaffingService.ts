/**
 *  dasStaffingService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { FieldSet, Record } from "airtable";
import { dasAirtableService } from "./airtableService";

type StaffingNeed = {
    id: string,
    status: string,
    importance: string,
    timing: string,
    ventureIds: string[],
    roles: string[],
    role: string[],
    volunteerAssigned: string[],
    contributors: string[]
}

class DASStaffingService {
    static STAFFING_TABLE = 'tbllAEHFTFX5IZDZL';

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

    newStaffingNeed(): StaffingNeed {
        return {
            id: '',
            status: '',
            importance: '',
            timing: '',
            ventureIds: [],
            roles: [],
            role: [],
            volunteerAssigned: [],
            contributors: []
        } as StaffingNeed
    }

    transform(r: Record<FieldSet>): StaffingNeed {
        return {
            id: r.id,
            status: r.fields['Status'],
            importance: r.fields['Importance'],
            timing: r.fields['Timing'],
            ventureIds: r.fields['Prospective Ventures'],
            roles: r.fields['Role in text for website'],
            role: r.fields['Role'],
            volunteerAssigned: r.fields['Volunteer Assigned'],
            contributors: r.fields['Contributor in text for website']
        } as StaffingNeed
    }

    async findAll(project?: any): Promise<StaffingNeed[]> {
        const filter = project
            ? `FIND('${project.ventureCode}', ARRAYJOIN({Prospective Ventures}))`
            : ''
        return dasAirtableService.getAll(DASStaffingService.STAFFING_TABLE, filter)
            .then(records => records.map(r => this.transform(r)))
    }

    update = async (changes: any): Promise<any> => {
        return dasAirtableService
            .base(DASStaffingService.STAFFING_TABLE)
            .update([changes])
            .then((resp: any) => {
                if (resp.error) {
                    throw resp.error
                }
                return this.transform(resp[0])
            })
    }

    create = async (record: any): Promise<StaffingNeed> => {
        return dasAirtableService.createRecord(DASStaffingService.STAFFING_TABLE, record)
    }
}

const dasStaffingService = new DASStaffingService();
export { DASStaffingService, dasStaffingService };
export type { StaffingNeed };

