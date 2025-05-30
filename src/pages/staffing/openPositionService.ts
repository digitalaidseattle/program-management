/**
 *  dasStaffingService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { FieldSet, Record } from 'airtable';

import { AirtableEntityService } from "@digitalaidseattle/airtable";
import { dasAirtableClient } from '../../sections/evaluation/api/airtableClient';

type OpenPosition = {
    id: string,
    status: string,
    ventureId: string,
    venture: string | undefined,
    ventureStatus: string | undefined,
    role: string,
    level: string,
    skill: string
}

const STAFFING_TABLE = 'tbllAEHFTFX5IZDZL';

class OpenPositionService extends AirtableEntityService<OpenPosition> {

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

    transform(r: Record<FieldSet>): OpenPosition {
        return {
            id: r.id,
            status: r.fields['Status'],
            ventureId: r.fields['Prospective Ventures'] ? (r.fields['Prospective Ventures'] as string[])[0] : undefined,
            venture: undefined,
            ventureStatus: undefined,
            role: r.fields['Role in text for website'] ? (r.fields['Role in text for website'] as string)[0] : undefined,
            level: r.fields['Level requirement'],
            skill: r.fields['Desired skills']
        } as OpenPosition
    }

    transformEntity(entity: Partial<OpenPosition>): Partial<FieldSet> {
        const fields: Partial<FieldSet> = {};

        if (entity.status !== undefined) {
            fields['Status'] = entity.status;
        }
        if (entity.ventureId !== undefined) {
            fields['Prospective Ventures'] = [entity.ventureId];
        }
        if (entity.role !== undefined) {
            fields['Role in text for website'] = entity.role;
        }
        if (entity.level !== undefined) {
            fields['Level requirement'] = entity.level;
        }
        if (entity.skill !== undefined) {
            fields['Desired skills'] = entity.skill;
        }
        // venture and ventureStatus are not stored directly in Airtable

        return fields;
    }

    findOpen = async (statuses: string[]): Promise<OpenPosition[]> => {
        const filter = `OR(${statuses.map(s => `{Status} = "${s}"`).join(", ")})`;
        return super.getAll(undefined, filter);
    }

}

const openPositionService = new OpenPositionService();
export { openPositionService };
export type { OpenPosition };

