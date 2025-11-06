/**
 *  proctorService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { CodaRow } from '../../services/codaService';

type Proctor = {
    id: string,
    name: string,
    email: string,
}

// @ts-ignore - Environment variables are defined at runtime
const PROCTOR_TABLE_ID = import.meta.env.VITE_CODA_PROCTOR_TABLE_ID;
// @ts-ignore
const LINK_TABLE_ID = import.meta.env.VITE_CODA_SCHEDULE_LINK_TABLE_ID;

const NAME_KEY = 'c-x0QRJJXWk9';
const EMAIL_KEY = 'c-FZ2nIGJhbt';

const CODA_COLUMNS = {
    links: { url: 'Scheduling link', status: 'Status', interviewer: 'Interviewer' }
} as const;
const DEFAULT_LINK_STATUS = 'Available';

class ProctorService {
    mapJson(row: CodaRow): Proctor {
        const proctor = {
            id: row.id,
            name: row.values[NAME_KEY] || '',
            email: row.values[EMAIL_KEY] || ''
        } as Proctor;
        return proctor;
    }

    async getAll(): Promise<Proctor[]> {
        const { codaService } = await import('../../services/codaService');
        const rows = await codaService.getRows(PROCTOR_TABLE_ID);
        const proctors = rows
            .map(row => this.mapJson(row))
            .filter(p => p.name !== '' && p.email !== '');
        return proctors;
    }

    async findByEmail(email: string): Promise<Proctor | null> {
        const proctors = await this.getAll();
        const emailLower = email.toLowerCase();
        return proctors.find(p => p.email.toLowerCase() === emailLower) || null;
    }

    async addBookingLinks(proctor: Proctor, bookingLinks: string[]): Promise<any> {
        const rows = bookingLinks.map((link) => ({
            cells: [
                { column: CODA_COLUMNS.links.url, value: link },
                { column: CODA_COLUMNS.links.status, value: DEFAULT_LINK_STATUS },
                { column: CODA_COLUMNS.links.interviewer, value: proctor.name }
            ]
        }));
        const { codaService } = await import('../../services/codaService');
        return codaService.createRows(LINK_TABLE_ID, rows);
    }

}

const proctorService = new ProctorService();
export { proctorService };
export type { Proctor };

