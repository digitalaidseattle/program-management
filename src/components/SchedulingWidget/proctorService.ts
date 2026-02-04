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
const PROCTOR_TABLE_ID = import.meta.env.VITE_CODA_PROCTOR_TABLE_ID;

// Column IDs discovered from Coda API for proctor table
const NAME_KEY = 'c-mFmHr9G0kc';        // "Name" column
const DAS_EMAIL_KEY = 'c-8mnE-hcSOT';  // "DAS email" column
const PERSONAL_EMAIL_KEY = 'c-yVZXbtwgEP'; // "Personal email" column

function coda2Entity(row: CodaRow): Proctor {
    // Use DAS email as primary, fallback to personal email
    const dasEmail = row.values[DAS_EMAIL_KEY] || '';
    const personalEmail = row.values[PERSONAL_EMAIL_KEY] || '';
    const email = dasEmail || personalEmail;

    const proctor = {
        id: row.id,
        name: row.values[NAME_KEY] || '',
        email: email,
    } as Proctor;
    return proctor;
}

class ProctorService extends CodaService<Proctor> {

    constructor() {
        super(PROCTOR_TABLE_ID, undefined, coda2Entity, undefined);
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

