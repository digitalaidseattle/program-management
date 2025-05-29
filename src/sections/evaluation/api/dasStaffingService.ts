/**
 *  dasStaffingService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { AirtableEntityService } from "@digitalaidseattle/airtable";
import { FieldSet, Record } from "airtable";
import { dasAirtableClient } from "../../../services/airtableClient";

type StaffingNeed = {
    id: string,
    status: string,
    importance: string,
    timing: string,
    ventureIds: string[],
    roles: string[],
    role: string[],
    volunteerAssigned: string[],
    contributors: string[],
    levelRequirement: string,
    desiredSkills: string
}

const STAFFING_TABLE = 'tbllAEHFTFX5IZDZL';

class DASStaffingService extends AirtableEntityService<StaffingNeed> {

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

    EXPERIENCE_LEVELS = [
        "Junior",
        "Mid",
        "Senior"
    ]

    public constructor() {
        super(dasAirtableClient, STAFFING_TABLE);
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
            contributors: [],
            levelRequirement: this.EXPERIENCE_LEVELS[0],
            desiredSkills: ''
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
            contributors: r.fields['Contributor in text for website'],
            levelRequirement: r.fields['Level requirement'],
            desiredSkills: r.fields['Desired skills'],
        } as StaffingNeed
    }

    transformEntity(entity: Partial<StaffingNeed>): Partial<FieldSet> {
        return {
            'Status': entity.status,
            'Importance': entity.importance,
            'Timing': entity.timing,
            'Prospective Ventures': entity.ventureIds,
            'Role in text for website': entity.roles,
            'Role': entity.role,
            'Volunteer Assigned': entity.volunteerAssigned,
            'Contributor in text for website': entity.contributors,
            'Level requirement': entity.levelRequirement,
            'Desired skills': entity.desiredSkills,
        };
    }

    findAll = async (project?: any): Promise<StaffingNeed[]> => {
        const filter = project
            ? `FIND('${project.ventureCode}', ARRAYJOIN({Prospective Ventures}))`
            : ''
        return super.getAll(undefined, filter)
    }

}

const dasStaffingService = new DASStaffingService();
export { DASStaffingService, dasStaffingService };
export type { StaffingNeed };

