/**
 *  proctorService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { CodaRow, CodaService } from '../../services/codaService';

type Proctor = {
    id: string,
    name: string,
    email: string,
}
// @ts-ignore - Environment variables are defined at runtime
const CODA_DOC_ID = import.meta.env.VITE_CODA_DOC_ID;
const PROCTOR_TABLE_ID = import.meta.env.VITE_CODA_PROCTOR_TABLE_ID;

function coda2Entity(row: CodaRow): Proctor {
    // Use DAS email as primary, fallback to personal email
    const dasEmail = row.values['DAS email'];
    const personalEmail = row.values['Personal email'];
    const email: string = (dasEmail || personalEmail) ?? '';

    const proctor = {
        id: row.id,
        name: (row.values['Name'] || '').replace(/`/g, ''),
        email: (email || '').replace(/`/g, ''),
    } as Proctor;
    return proctor;
}

class ProctorService extends CodaService<Proctor> {

    constructor() {
        super(CODA_DOC_ID, PROCTOR_TABLE_ID, { mapper: coda2Entity });
    }

    async getAll(): Promise<Proctor[]> {
        return super.getAll()
            .then(proctors => proctors.filter(p => p.name !== '' && p.email !== ''))
    }

    async findByEmail(email: string): Promise<Proctor | undefined | null> {
        if (!email) return null;
        const emailLower = email.toLowerCase();
        const proctors = await this.getAll();
        return proctors.find(proctor => proctor.email.toLowerCase() === emailLower);
    }

}

const proctorService = new ProctorService();
export { proctorService };
export type { Proctor };

