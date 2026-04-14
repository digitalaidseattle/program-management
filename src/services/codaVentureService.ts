/**
 *  proctorService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { CodaRow, CodaService } from './codaService';
import { Venture } from './dasVentureService';

const CODA_DOC_ID = '24QYb2RP0g'
const VENTURE_TABLE_ID = 'grid-UdXLv7wwqh';

function coda2Entity(row: CodaRow): Venture {
    const venture = {
        id: '',
        airtable_id: '',
        coda_id: row.id,
        partner_id: null,
        title: row.values['Ventures'].replace(/`/g, ""),
        painpoint: row.values['Details'].replace(/`/g, ""),
        status: row.values['Venture Status'].replace(/`/g, ""),
        problem: '',
        solution: '',
        impact: '',
        program_areas: [],
        venture_code: row.values['Ventures'].replace(/`/g, ""),
        partner_airtable_id: [],
    } as Venture;
    return venture;
}

class CodaVentureService extends CodaService<Venture> {

    private static _instance: CodaVentureService;

    static getInstance(): CodaVentureService {
        if (!this._instance) {
            this._instance = new CodaVentureService();
        }
        return this._instance;
    }

    constructor() {
        super(CODA_DOC_ID, VENTURE_TABLE_ID, { mapper: coda2Entity });
    }

}

export { CodaVentureService };

