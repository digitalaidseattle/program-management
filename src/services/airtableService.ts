import Airtable, { FieldSet, Records } from 'airtable';
import { dasAirtableClient, pmAirtableClient } from './airtableClient';
import { QueryModel } from '@digitalaidseattle/supabase';


class AirtableService {
    base: Airtable.Base;

    public constructor(airTableBase: Airtable.Base) {
        this.base = airTableBase
    }

    async query(tableId: string, queryModel: QueryModel): Promise<Records<FieldSet>> {
        const table = this.base(tableId);
        const params = {
            offset: queryModel.page,
            maxRecords: queryModel.pageSize,
            sortBy: {
                field: queryModel.sortField,
                direction: queryModel.sortDirection
            }
        }
        return table
            .select(params)
            .all();
    }

    async getAll(
        tableId: string,
        filterByFormula?: string
    ): Promise<Records<FieldSet>> {
        const table = this.base(tableId);
        let all = [] as Records<FieldSet>;
        await table
            .select({filterByFormula: filterByFormula, })
            .eachPage(
                (records, fetchNextPage) => {
                    // REVIEW not sure this is recursing past 100 records
                    all = [...all, ...records];
                    fetchNextPage();
                })
        return all;
    }

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
    // look into this
    // table.select({
    //     filterByFormula: `FIND('Important', {Tags})`,
    // }).eachPage((records, fetchNextPage) => {
    //     records.forEach(record => {
    //         console.log(record.fields);
    //     });
    //     fetchNextPage();
    // });

    async getRecord(
        tableId: string,
        recordId: string
    ): Promise<any> {
        return this.base(tableId).find(recordId);
    }

    async update(
        tableId: string,
        recordId: string,
        changes: any
    ): Promise<any> {
        return this.base(tableId).update(recordId, changes);
    }

    async createRecord(
        tableId: string,
        record: any
    ): Promise<any> {
        return this.base(tableId).create(record);
    }
}

const dasAirtableService = new AirtableService(dasAirtableClient.base(import.meta.env.VITE_AIRTABLE_BASE_ID_DAS));
const pmAirtableService = new AirtableService(pmAirtableClient.base(import.meta.env.VITE_AIRTABLE_PM_BASE_ID_DAS));

export { dasAirtableService, pmAirtableService };
