/**
 *  dasTaskService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { FieldSet, Record } from "airtable";
import { dasAirtableClient } from "../../../services/airtableClient";
import { AirtableRecordService } from "../../../services/airtableRecordService";

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
const TASK_DETAIL_TABLE = 'tblOku4Z4Fiqyx6S8';

class DASTaskService extends AirtableRecordService<Task> {

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

    public constructor() {
        super(dasAirtableClient.base(import.meta.env.VITE_AIRTABLE_BASE_ID_DAS), TASK_DETAIL_TABLE);
    }

    emptyTask(): Task {
        return {
            id: '',
            title: '',
            phase: DASTaskService.TASK_PHASES[0],
            request: '',
            requestDetails: '',
            driId: '',
            driEmail: '',
            status: DASTaskService.TASK_STATUSES[0],
            dueDate: ''
        }
    }

    airtableTransform(record: Record<FieldSet>): Task {
        return {
            id: record.id,
            title: record.fields['The request'],
            phase: Number.parseInt(record.fields['Phase'] as string),
            request: record.fields['The Request'],
            requestDetails: record.fields['Request Details'],
            driId: record.fields['DRI'],
            driEmail: record.fields['DRI Email'],
            status: record.fields['Status'],
            dueDate: record.fields["Due date"]
        } as Task;
    }

    // update = async (changes: any): Promise<any> => {
    //     return dasAirtableService
    //         .base(TASK_DETAIL_TABLE)
    //         .update([changes])
    //         .then((records: any) => {
    //             console.log('update', records)
    //             return records
    //         })
    // }
}

const dasTaskService = new DASTaskService()
export { DASTaskService, dasTaskService };
export type { Task };
