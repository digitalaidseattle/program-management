/**
 *  codaService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

// @ts-ignore - Vite injects env at runtime
const CODA_API_TOKEN = import.meta.env.VITE_CODA_API_TOKEN;
// @ts-ignore
const CODA_DOC_ID = import.meta.env.VITE_CODA_DOC_ID;

const CODA_API_BASE = `https://coda.io/apis/v1/docs/${CODA_DOC_ID}`;

type CodaRow = {
    id: string;
    values: Record<string, any>;
}

class CodaService {
    async getRows(tableId: string): Promise<CodaRow[]> {
        const url = `${CODA_API_BASE}/tables/${tableId}/rows`;
        const resp = await fetch(url, { 
            headers: { 'Authorization': `Bearer ${CODA_API_TOKEN}` } 
        });
        
        if (!resp.ok) {
            const error = await resp.json().catch(() => ({ message: resp.statusText }));
            throw new Error(`Failed to fetch rows: ${error.message || resp.statusText}`);
        }
        
        const data = await resp.json();
        return (data.items || []) as CodaRow[];
    }

    async createRows(tableId: string, rows: { cells: { column: string, value: any }[] }[]): Promise<any> {
        const resp = await fetch(`${CODA_API_BASE}/tables/${tableId}/rows`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CODA_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rows })
        });
        
        if (!resp.ok) {
            const error = await resp.json().catch(() => ({ message: resp.statusText }));
            throw new Error(`Failed to create rows: ${error.message || resp.statusText}`);
        }
        
        return resp.json();
    }
}

const codaService = new CodaService();
export { codaService };
export type { CodaRow };
