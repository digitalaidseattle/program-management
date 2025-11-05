/**
 *  proctorService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

type Proctor = {
    id: string,
    name: string,
    email: string,
}

// @ts-ignore - Environment variables are defined at runtime
const CODA_API_TOKEN = import.meta.env.VITE_CODA_API_TOKEN;
// @ts-ignore
const CODA_DOC_ID = import.meta.env.VITE_CODA_DOC_ID;
// @ts-ignore
const PROCTOR_TABLE_ID = import.meta.env.VITE_CODA_PROCTOR_TABLE_ID;
// @ts-ignore
const LINK_TABLE_ID = import.meta.env.VITE_CODA_SCHEDULE_LINK_TABLE_ID;

const CODA_COLUMNS = {
    proctor: { name: 'Name', email: 'Email' },
    links: { url: 'Scheduling link', status: 'Status', interviewer: 'Interviewer' }
} as const;
const DEFAULT_LINK_STATUS = 'Available';

class ProctorService {

    async findByEmail(email: string): Promise<Proctor | null> {
        const { codaService } = await import('../../services/codaService');
        
        const rows = await codaService.getRows(PROCTOR_TABLE_ID);
        
        if (!rows || rows.length === 0) {
            return null;
        }
        
        const emailLower = email.toLowerCase();
        const row = rows.find(r => {
            const values = r.values || {};
            const emailValue = Object.values(values).find(v => 
                typeof v === 'string' && v.toLowerCase() === emailLower
            );
            return emailValue !== undefined;
        });
        
        if (!row) {
            return null;
        }
        
        const values = row.values || {};
        const emailValue = Object.values(values).find(v => 
            typeof v === 'string' && v.toLowerCase() === emailLower
        ) as string || '';
        const nameValue = Object.values(values).find(v => 
            typeof v === 'string' && v !== emailValue && v.trim().length > 0
        ) as string || '';
        
        return {
            id: row.id,
            name: nameValue,
            email: emailValue
        } as Proctor;
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

