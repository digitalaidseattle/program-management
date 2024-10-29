/**
 *  dasProjectService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { dasAirtableService } from "../../../services/airtableService";

const PARTNER_TABLE = 'tblqttKinLZJ2JXo7';
const VENTURES_TABLE = 'tblRpJek5SjacLaen'; // VENTURE SEEDS/PAINPOINTS TABLE

type Venture = {
    id: string
    title: string
    painpoint: string
    status: string
    problem: string
    solution: string
    impact: string
    description: string
    imageSrc: string
    programAreas: string
    projectLink: string
    ventureCode: string
    evaluatingTaskGroup: string
    partner: string
}
type VentureProps = {
    venture: Venture,
};

class DASProjectService {
    filteredStatuses = ['Active', 'Under evaluation'];

    async airtableTransform(fields: any): Promise<Venture> {
        return dasAirtableService.getRecord(PARTNER_TABLE, fields.Partner[0])
            .then(resp => {
                const logos: any[] = resp.fields['logo'] as any[];
                return {
                    id: fields['AirTable ID'],
                    title: resp.fields['Org name'],
                    painpoint: fields['Painpoint Shorthand'],
                    status: fields['Status'],
                    problem: fields['Problem (for DAS website)'],
                    solution: fields['Solution (for DAS website)'],
                    impact: fields['Impact (for DAS website)'],
                    description: resp.fields['Org description'],
                    imageSrc: (logos && logos.length > 0) ? logos[0].url : null,
                    programAreas: fields['Foci (from Partner)'],
                    projectLink: `project/${fields['AirTable ID']}`,
                    ventureCode: fields['Prospective Venture Code'],
                    evaluatingTaskGroup: fields['Evaluating Task Group'] ? fields['Evaluating Task Group'][0] : undefined,
                    partner: resp.fields['Org name']
                }
            })
    }

    async getAll(): Promise<Venture[]> {
        const MAX_RECORDS = 100;
        const FILTER = ``;
        // const ACTIVE_FILTER = '';
        return await dasAirtableService
            .getTableRecords(VENTURES_TABLE, MAX_RECORDS, FILTER)
            .then(records => Promise.all(records.map(record => this.airtableTransform(record.fields))))
    }

    async getAllByStatus(filteredStatuses: string[]): Promise<Venture[]> {
        const MAX_RECORDS = 100;
        const FILTER = `OR(${filteredStatuses.map(s => `{Status} = "${s}"`).join(", ")})`;
        return await dasAirtableService
            .getTableRecords(VENTURES_TABLE, MAX_RECORDS, FILTER)
            .then(records => Promise.all(records.map(record => this.airtableTransform(record.fields))))
    }

    getById = async (id: string): Promise<Venture> => {
        return dasAirtableService.getRecord(VENTURES_TABLE, id)
            .then(r => this.airtableTransform(r.fields))
    }

    update = async (venture: any, changes: any): Promise<Venture> => {
        return dasAirtableService.update(VENTURES_TABLE, venture.id, changes)
            .then(r => this.airtableTransform(r.fields))
    }

}

const dasProjectService = new DASProjectService()
export { dasProjectService };
export type { Venture, VentureProps };

