/**
 *  dasStaffingService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { FieldSet, Record } from "airtable";
import { dasAirtableClient } from "../../../services/airtableClient";
import { AirtableRecordService } from "../../../services/airtableRecordService";

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

const STAFFING_TABLE = 'tbllAEHFTFX5IZDZL';

class DASStaffingService extends AirtableRecordService<StaffingNeed> {
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
    
    public constructor() {
        super(dasAirtableClient.base(import.meta.env.VITE_AIRTABLE_BASE_ID_DAS), STAFFING_TABLE);
    }

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

    airtableTransform(r: Record<FieldSet>): StaffingNeed {
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


    findAll = async (project?: any): Promise<StaffingNeed[]>  => {
        const filter = project
            ? `FIND('${project.ventureCode}', ARRAYJOIN({Prospective Ventures}))`
            : ''
        return super.findAll(undefined, filter)
    }

}

const dasStaffingService = new DASStaffingService();
export { DASStaffingService, dasStaffingService };
export type { StaffingNeed };

