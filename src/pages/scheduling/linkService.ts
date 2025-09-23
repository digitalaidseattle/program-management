/**
 *  dasStaffingService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import Airtable, { FieldSet, Record, Records } from 'airtable';

import { AirtableEntityService } from "@digitalaidseattle/airtable";
import { Proctor } from './proctorService';

type Link = {
    id: string,
    status: string,
}

const applicantAirtableClient = new Airtable({ apiKey: import.meta.env.VITE_AIRTABLE_APPLICANT_PAT });
const LINK_TABLE = import.meta.env.VITE_AIRTABLE_APPLICANT_SCHEDULE_LINK_TABLE;

class LinkService extends AirtableEntityService<Link> {

    public constructor() {
        super(applicantAirtableClient, LINK_TABLE);
        this.base = applicantAirtableClient.base(import.meta.env.VITE_AIRTABLE_APPLICANT_BASE_ID);
    }

    transform(r: Record<FieldSet>): Link {
        console.log(r)
        return {
            id: r.id,
            status: r.fields['Status'],
        } as Link
    }

    transformEntity(_entity: Partial<Link>): Partial<FieldSet> {
        //  If we ever need to push links up, we need to fill this in
        const fields: Partial<FieldSet> = {};

        return fields;
    }

    addBookingLinks(proctor: Proctor, bookingLinks: string[]): Promise<Records<FieldSet>> {
        const records = bookingLinks.map((link) => ({
            fields: {
                'Scheduling link': link,
                'Status': 'Available',
                'Interviewer': [proctor.id]
            }
        }));
        return this.base(LINK_TABLE).create(records);
    }

    findAvailableByProctor(proctor: Proctor): Promise<any> {
        const FILTER =
            `AND(NOT({Interviewer} = BLANK()), {Status} = "Available",FIND("${proctor.name}", ARRAYJOIN({Interviewer}, ",")))`;
        return this.getAll(100, FILTER)
    }

}

const linkService = new LinkService();
export { linkService };
export type { Link };

