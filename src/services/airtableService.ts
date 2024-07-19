import Airtable, { FieldSet, Records } from 'airtable';
import { airtableClient } from './airtableClient';

class AirtableService {
    base: Airtable.Base = airtableClient.base(import.meta.env.VITE_AIRTABLE_PM_BASE_ID_DAS);

    async getTableRecords(
        tableId: string,
        maxRecords?: number,
        filterByFormula?: string
    ): Promise<Records<FieldSet>> {
        const table = this.base(tableId);
        try {
            const records = await table
                .select({
                    maxRecords: maxRecords || 100, // default max records is 100, more than that and we will need to start using pagination
                    filterByFormula: filterByFormula || '',
                })
                .all()
            return records
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getRecord(
        tableId: string,
        recordId: string
    ): Promise<any> {
        return this.base(tableId).find(recordId);
    }

    async createRecord(
        tableId: string,
        record: any
    ): Promise<any> {
        return this.base(tableId).create(record);
    }
}

const airtableService = new AirtableService();

export { airtableService } 