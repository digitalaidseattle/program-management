/**
 *  proctorService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { CodaRow, CodaService } from './codaService';
import { Venture } from './dasVentureService';

// @ts-ignore - Environment variables are defined at runtime
const VENTURE_TABLE_ID = 'grid-UdXLv7wwqh';

function coda2Entity(row: CodaRow): Venture {
    console.log(row)

    const venture = {

    } as Venture;
    return venture;
}

class CodaVentureService extends CodaService<Venture> {

    constructor() {
        super(VENTURE_TABLE_ID, undefined, coda2Entity, undefined);
    }

    async getAll(): Promise<Venture[]> {
        return super.getAll();
    }



}

export { CodaVentureService };

