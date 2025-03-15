/**
 *  dasStaffingService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { FieldSet, Record } from "airtable";
import { dasAirtableClient } from "../../services/airtableClient";
import { AirtableRecordService } from "../../services/airtableRecordService";

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

class OpenPositionService extends AirtableRecordService<OpenPosition> {
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
        super(dasAirtableClient.base(import.meta.env.VITE_AIRTABLE_BASE_ID_DAS), STAFFING_TABLE);
    }

    airtableTransform(r: Record<FieldSet>): OpenPosition {
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

    findOpen = async (statuses: string[]): Promise<OpenPosition[]> => {
        const filter = `OR(${statuses.map(s => `{Status} = "${s}"`).join(", ")})`;
        return super.findAll(undefined, filter)
    }

}

const openPositionService = new OpenPositionService();
export { openPositionService };
export type { OpenPosition };

