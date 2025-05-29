/**
 *  dasProjectService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { AirtableEntityService } from "@digitalaidseattle/airtable";
import Airtable from "airtable";
import { dasAirtableClient } from "../../../services/airtableClient";
import { dasPartnerService, Partner } from "./dasPartnerService";

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


class DASProjectService extends AirtableEntityService<Venture> {

    filteredStatuses = ['Active', 'Under evaluation'];

    public constructor() {
        super(dasAirtableClient, VENTURES_TABLE);
    }

    transform(record: any): Venture {
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

    transformEntity(entity: Partial<Venture>): Partial<Airtable.FieldSet> {
        return {
            'Title': entity.title,
            'Painpoint Shorthand': entity.painpoint,
            'Status': entity.status,
            'Problem (for DAS website)': entity.problem,
            'Solution (for DAS website)': entity.solution,
            'Impact (for DAS website)': entity.impact,
            'Foci (from Partner)': entity.programAreas,
            'Prospective Venture Code': entity.ventureCode,
            'Evaluating Task Group': entity.evaluatingTaskGroup ? [entity.evaluatingTaskGroup] : undefined,
            'Partner': entity.partnerId ? [entity.partnerId] : undefined
        };
    }
    async getById(recordId: string): Promise<Venture> {
        return super.getById(recordId)
            .then(venture =>
                dasPartnerService
                    .getById(venture.partnerId)
                    .then(partner => Object.assign(venture, { partner: partner }))
            );
    }

    async getAllByStatus(filteredStatuses: string[]): Promise<Venture[]> {
        const FILTER = `OR(${filteredStatuses.map(s => `{Status} = "${s}"`).join(", ")})`;
        return this.getAll(undefined, FILTER)
            .then(ventures =>
                Promise
                    .all(ventures.map(v => dasPartnerService.getById(v.partnerId)))
                    .then(partners => ventures.map((ven, idx) => Object.assign(ven, { partner: partners[idx] })))
            )
    }

}

const dasProjectService = new DASProjectService()
export { dasProjectService };
export type { Venture, VentureProps };

