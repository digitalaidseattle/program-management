/**
 *  dasDisciplinesService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { FieldSet, Record } from "airtable";
import { useEffect, useState } from "react";
import { dasAirtableClient } from "../../../services/airtableClient";
import { AirtableRecordService } from "../../../services/airtableRecordService";

const DISCIPLINES_TABLE = 'tblAL15eUBFRIrdVH';

type Discipline = {
    id: string
    name: string
}

class DASDisciplinesService extends AirtableRecordService<Discipline> {

    public constructor() {
        super(dasAirtableClient.base(import.meta.env.VITE_AIRTABLE_BASE_ID_DAS), DISCIPLINES_TABLE);
    }

    airtableTransform(record: Record<FieldSet>): Discipline {
        return {
            id: record.id,
            name: record.fields['Name']
        } as Discipline
    }

};

const useDisciplines = () => {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setStatus('fetching');
            const response = await dasDisciplinesService
                .findAll()
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

