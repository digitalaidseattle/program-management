/**
 *  dasStaffingService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import Airtable, { FieldSet, Record } from 'airtable';

import { AirtableEntityService } from "@digitalaidseattle/airtable";

type Proctor = {
    id: string,
    name: string,
    email: string,
}

const applicantAirtableClient = new Airtable({ apiKey: import.meta.env.VITE_AIRTABLE_APPLICANT_PAT });
const PROCTOR_TABLE = import.meta.env.VITE_AIRTABLE_APPLICANT_PROCTOR_TABLE;

class ProctorService extends AirtableEntityService<Proctor> {

    public constructor() {
        super(applicantAirtableClient, PROCTOR_TABLE);
        this.base = applicantAirtableClient.base(import.meta.env.VITE_AIRTABLE_APPLICANT_BASE_ID);
    }

    transform(r: Record<FieldSet>): Proctor {
        return {
            id: r.id,
            name: r.fields['Name'],
            email: r.fields['OS email']
        } as Proctor
    }

    transformEntity(_entity: Partial<Proctor>): Partial<FieldSet> {
        //  If we ever need to push proctors up, we need to fill this in
        const fields: Partial<FieldSet> = {};

        return fields;
    }

    async findByEmail(email: string): Promise<Proctor | null> {
        const filter = `LOWER({OS email}) = "${email.toLowerCase()}"`
        const proctors = await this.getAll(1, filter);
        return proctors.length == 0 ? null : proctors[0];
    }

}

const proctorService = new ProctorService();
export { proctorService };
export type { Proctor };

