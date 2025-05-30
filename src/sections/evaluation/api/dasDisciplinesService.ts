/**
 *  dasDisciplinesService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { AirtableEntityService } from "@digitalaidseattle/airtable";
import { FieldSet, Record } from "airtable";
import { useEffect, useState } from "react";
import { dasAirtableClient } from "./airtableClient";

const DISCIPLINES_TABLE = 'tblAL15eUBFRIrdVH';

type Discipline = {
    id: string
    name: string
}

class DASDisciplinesService extends AirtableEntityService<Discipline> {

    public constructor() {
        super(dasAirtableClient, DISCIPLINES_TABLE);
    }

    transform(record: Record<FieldSet>): Discipline {
        return {
            id: record.id,
            name: record.fields['Name']
        } as Discipline
    }

    transformEntity(entity: Partial<Discipline>): Partial<FieldSet> {
        const fields: Partial<FieldSet> = {};
        if (entity.name !== undefined) {
            fields['Name'] = entity.name;
        }
        return fields;
    }
};

const useDisciplines = () => {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setStatus('fetching');
            const response = await dasDisciplinesService
                .getAll()
                .then(recs => recs.sort((d1, d2) => d1.name.localeCompare(d2.name)))
            setData(response);
            setStatus('fetched');
        };
        fetchData();
    }, []);

    return { status, data };
};

const dasDisciplinesService = new DASDisciplinesService()
export { dasDisciplinesService, useDisciplines };
export type { Discipline };

