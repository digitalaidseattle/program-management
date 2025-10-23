import { AirtableEntityService } from "@digitalaidseattle/airtable";
import Airtable, { FieldSet, Record } from "airtable";

export const dasAirtableClient = new Airtable({ apiKey: import.meta.env.VITE_AIRTABLE_PAT })

export class AirtableService extends AirtableEntityService<any> {

    public constructor(table: string) {
        super(dasAirtableClient, table);
    }

    transform(r: Record<FieldSet>): any {
        return {
            ...r.fields,
            id: r.id,

        }
    }

    transformEntity(_entity: Partial<any>): Partial<FieldSet> {
        return {
        };
    }
}

