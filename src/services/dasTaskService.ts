/**
 *  dasTaskService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { dasAirtableService } from "./airtableService";

const TASK_DETAIL_TABLE = 'tblOku4Z4Fiqyx6S8';

type Task = {
    id: string;
    title: string;
    phase: number;
    request: string;
    requestDetails: string;
    driId: string;
    driEmail: string;
    status: string;
}
class DASTaskService {
    getById = async (id: string): Promise<any> => {
        return dasAirtableService
            .getRecord(TASK_DETAIL_TABLE, id)
            .then(record => {
                console.log('getById', record)
                return {
                    id: record.id,
                    title: record.fields['The request'],
                    phase: Number.parseInt(record.fields['Phase'] as string),
                    requestDetails: record.fields['Request Details'],
                    driId: record.fields['DRI'],
                    driEmail: record.fields['DRI Email'],
                    status: record.fields['Status'],
                    dueDate: record.fields["Due date"]
                }
            })
    }

    update = async (changes: any): Promise<any> => {
        return dasAirtableService
            .base(TASK_DETAIL_TABLE)
            .update([changes])
            .then((records: any) => {
                console.log('update', records)
                return records
            })
    }
}

const dasTaskService = new DASTaskService()
export { dasTaskService };
export type { Task }