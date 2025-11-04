/**
 *  dasStaffingService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import Airtable, { FieldSet, Record, Records } from 'airtable';

import { AirtableEntityService } from "@digitalaidseattle/airtable";

type Proctor = {
    id: string,
    name: string,
    email: string,
}

const applicantAirtableClient = new Airtable({ apiKey: import.meta.env.VITE_AIRTABLE_APPLICANT_PAT });
const PROCTOR_TABLE = import.meta.env.VITE_AIRTABLE_APPLICANT_PROCTOR_TABLE;
const LINK_TABLE = import.meta.env.VITE_AIRTABLE_APPLICANT_SCHEDULE_LINK_TABLE;

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
        //TODO
        const fields: Partial<FieldSet> = {};

        return fields;
    }

    async findByEmail(email: string): Promise<Proctor | null> {
        const filter = `LOWER({OS email}) = "${email.toLowerCase()}"`
        const proctors = await this.getAll(1, filter);
        return proctors.length == 0 ? null : proctors[0];
    }

    async addBookingLinks(proctor: Proctor, bookingLinks: string[]): Promise<Records<FieldSet>> {
        const records = bookingLinks.map((link) => ({
            fields: {
                'Scheduling link': link,
                'Status': 'Available',
                'Interviewer': [proctor.id]
            }
        }));
        const booked = await this.base(LINK_TABLE).create(records);
        return booked
    }

}

const proctorService = new ProctorService();
export { proctorService };
export type { Proctor };

