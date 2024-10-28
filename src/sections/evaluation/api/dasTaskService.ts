/**
 *  dasTaskService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { dasAirtableService } from "../../../services/airtableService";

type Task = {
    id: string;
    title: string;
    phase: number;
    request: string;
    requestDetails: string;
    driId: string;
    driEmail: string;
    status: string;
    dueDate: string;
}
class DASTaskService {
    static TASK_DETAIL_TABLE = 'tblOku4Z4Fiqyx6S8';
    static TASK_STATUSES = [
        "inbox",
        "needs re-work",
        "Approved",
        "Delivered",
        "In progress",
        "Todo",
        "Someday maybe",
        "Paused",
    ];
    static TASK_PHASES = [0, 1, 2, 3, 4, 5, 6, 7, 8]

    getById = async (id: string): Promise<any> => {
        return dasAirtableService
            .getRecord(DASTaskService.TASK_DETAIL_TABLE, id)
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
            .base(DASTaskService.TASK_DETAIL_TABLE)
            .update([changes])
            .then((records: any) => {
                console.log('update', records)
                return records
            })
    }
}

const dasTaskService = new DASTaskService()
export { DASTaskService, dasTaskService };
export type { Task }