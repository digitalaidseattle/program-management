/**
 *  proctorService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { CodaRow, codaService } from '../../services/codaService';

type Proctor = {
    id: string,
    name: string,
    email: string,
}

// @ts-ignore - Environment variables are defined at runtime
const PROCTOR_TABLE_ID = import.meta.env.VITE_CODA_PROCTOR_TABLE_ID;
// @ts-ignore
const LINK_TABLE_ID = import.meta.env.VITE_CODA_SCHEDULE_LINK_TABLE_ID;

// Column IDs discovered from Coda API for proctor table
const NAME_KEY = 'c-mFmHr9G0kc';        // "Name" column
const DAS_EMAIL_KEY = 'c-8mnE-hcSOT';  // "DAS email" column
const PERSONAL_EMAIL_KEY = 'c-yVZXbtwgEP'; // "Personal email" column

// Column IDs discovered from Coda API for schedule link table (grid-mp-Lzk8BLN)
const CODA_COLUMNS = {
    links: { 
        url: 'c-6ZlUhINYhy',      // "Link" column
        status: 'c-bcWSzbGxNd',   // "Status" column
        interviewer: 'c-txayd-tSjq' // "Interviewer" column
    }
} as const;
const DEFAULT_LINK_STATUS = 'Available';

class ProctorService {
    mapJson(row: CodaRow): Proctor {
        // Use DAS email as primary, fallback to personal email
        const dasEmail = row.values[DAS_EMAIL_KEY] || '';
        const personalEmail = row.values[PERSONAL_EMAIL_KEY] || '';
        const email = dasEmail || personalEmail;
        
        const proctor = {
            id: row.id,
            name: row.values[NAME_KEY] || '',
            email: email
        } as Proctor;
        return proctor;
    }

    async getAll(): Promise<Proctor[]> {
        const rows = await codaService.getRows(PROCTOR_TABLE_ID);
        const proctors = rows
            .map(row => this.mapJson(row))
            .filter(p => p.name !== '' && p.email !== '');
        return proctors;
    }

    async findByEmail(email: string): Promise<Proctor | null> {
        if (!email) return null;
        
        const rows = await codaService.getRows(PROCTOR_TABLE_ID);
        const emailLower = email.toLowerCase();
        
        // Check both DAS email and Personal email columns
        for (const row of rows) {
            const dasEmail = (row.values[DAS_EMAIL_KEY] || '').toLowerCase();
            const personalEmail = (row.values[PERSONAL_EMAIL_KEY] || '').toLowerCase();
            const name = row.values[NAME_KEY] || '';
            
            if ((dasEmail === emailLower || personalEmail === emailLower) && name) {
                return {
                    id: row.id,
                    name: name,
                    email: dasEmail || personalEmail || email
                };
            }
        }
        
        return null;
    }

    async addBookingLinks(proctor: Proctor, bookingLinks: string[]): Promise<any> {
        const rows = bookingLinks.map((link) => ({
            cells: [
                { column: CODA_COLUMNS.links.url, value: link },
                { column: CODA_COLUMNS.links.status, value: DEFAULT_LINK_STATUS },
                { column: CODA_COLUMNS.links.interviewer, value: proctor.name }
            ]
        }));
        return codaService.createRows(LINK_TABLE_ID, rows);
    }

}

const proctorService = new ProctorService();
export { proctorService };
export type { Proctor };

