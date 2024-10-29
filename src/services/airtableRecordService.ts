import Airtable, { FieldSet, Record } from 'airtable';


abstract class AirtableRecordService<T> {

    base: Airtable.Base;
    tableId: string;

    public constructor(airTableBase: Airtable.Base, tableId: string) {
        this.base = airTableBase;
        this.tableId = tableId;
    }

    abstract airtableTransform(record: Record<FieldSet>): T;

    async findAll(
        maxRecords?: number,
        filterByFormula?: string
    ): Promise<T[]> {
        try {
            const records = await this.base(this.tableId)
                .select({
                    maxRecords: maxRecords || 100, // default max records is 100, more than that and we will need to start using pagination
                    filterByFormula: filterByFormula || '',
                })
                .all()
            return records.map(rec => this.airtableTransform(rec))
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    // async getAll(
    //     tableId: string,
    //     filterByFormula?: string
    // ): Promise<Records<FieldSet>> {
    //     const table = this.base(tableId);
    //     let all = [] as Records<FieldSet>;
    //     await table
    //         .select({filterByFormula: filterByFormula, })
    //         .eachPage(
    //             (records, fetchNextPage) => {
    //                 // REVIEW not sure this is recursing past 100 records
    //                 all = [...all, ...records];
    //                 fetchNextPage();
    //             })
    //         .then()
    //     return all;
    // }

    async getById(recordId: string): Promise<T> {
        return this.base(this.tableId)
            .find(recordId)
            .then(rec => this.airtableTransform(rec));
    }

    async update(
        recordId: string,
        changes: Partial<FieldSet>
    ): Promise<T> {
        return this.base(this.tableId)
            .update(recordId, changes)
            .then(rec => this.airtableTransform(rec))
    }

    async create(
        record: any
    ): Promise<any> {
        return this.base(this.tableId).create(record);
    }
}

export { AirtableRecordService };
