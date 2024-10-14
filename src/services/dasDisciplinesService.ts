/**
 *  dasDisciplinesService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { useEffect, useState } from "react";
import { dasAirtableService } from "./airtableService";

const DISCIPLINES_TABLE = 'tblAL15eUBFRIrdVH';

const MAX_RECORDS = 200;
const FILTER = ``;

type Discipline = {
    id: string
    name: string
}

class DASDisciplinesService {
    transform(r: any): Discipline {
        return {
            id: r.id,
            name: r.fields['Name']
        }
    }

    getAll = async (): Promise<Discipline[]> => {
        return dasAirtableService.getTableRecords(DISCIPLINES_TABLE, MAX_RECORDS, FILTER)
            .then(records => records.map(r => this.transform(r)));
    }

}

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

