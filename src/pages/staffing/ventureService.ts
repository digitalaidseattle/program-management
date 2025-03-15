/**
 *  VentureService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { dasAirtableClient } from "../../services/airtableClient";
import { AirtableRecordService } from "../../services/airtableRecordService";
import { dasPartnerService, Partner } from "../../sections/evaluation/api/dasPartnerService";

const VENTURES_TABLE = 'tblRpJek5SjacLaen'; // VENTURE SEEDS/PAINPOINTS TABLE

type Venture = {
    id: string
    title: string
    painpoint: string
    status: string
    problem: string
    solution: string
    impact: string
    programAreas: string
    projectLink: string
    ventureCode: string
    evaluatingTaskGroup: string
    partner: Partner
    partnerId: string
}
type VentureProps = {
    venture: Venture,
};

class VentureService extends AirtableRecordService<Venture> {
    filteredStatuses = ['Active', 'Under evaluation'];

    public constructor() {
        super(dasAirtableClient.base(import.meta.env.VITE_AIRTABLE_BASE_ID_DAS), VENTURES_TABLE);
    }

    airtableTransform(record: any): Venture {
        return {
            id: record.id,
            painpoint: record.fields['Painpoint Shorthand'],
            status: record.fields['Status'],
            problem: record.fields['Problem (for DAS website)'],
            solution: record.fields['Solution (for DAS website)'],
            impact: record.fields['Impact (for DAS website)'],
            programAreas: record.fields['Foci (from Partner)'],
            projectLink: `project/${record.id}`,
            ventureCode: record.fields['Prospective Venture Code'],
            evaluatingTaskGroup: record.fields['Evaluating Task Group'] ? record.fields['Evaluating Task Group'][0] : undefined,
            partnerId: record.fields["Partner"] ? record.fields["Partner"][0] : undefined
        } as Venture
    }

    async getById(recordId: string): Promise<Venture> {
        return super.getById(recordId)
            .then(venture =>
                dasPartnerService
                    .getById(venture.partnerId)
                    .then(partner => Object.assign(venture, { partner: partner }))
            );
    }

    async getAll(): Promise<Venture[]> {
        const FILTER = ``;
        return this.findAll(undefined, FILTER)
            .then(ventures =>
                Promise
                    .all(ventures.map(v => dasPartnerService.getById(v.partnerId)))
                    .then(partners => ventures.map((ven, idx) => Object.assign(ven, { partner: partners[idx] })))
            )
    }

}

const ventureService = new VentureService()
export { ventureService };
export type { Venture, VentureProps };

