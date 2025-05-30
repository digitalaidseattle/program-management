/**
 *  dasTaskService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { AirtableEntityService } from "@digitalaidseattle/airtable";
import { FieldSet, Record } from "airtable";
import { dasAirtableClient } from "./airtableClient";

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

class DASTaskService extends AirtableEntityService<Task> {


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
        super(dasAirtableClient, TASK_DETAIL_TABLE);
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

    transform(record: Record<FieldSet>): Task {
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

    transformEntity(entity: Partial<Task>): Partial<FieldSet> {
        return {
            ...(entity.title !== undefined && { 'The request': entity.title }),
            ...(entity.phase !== undefined && { 'Phase': entity.phase }),
            ...(entity.request !== undefined && { 'The Request': entity.request }),
            ...(entity.requestDetails !== undefined && { 'Request Details': entity.requestDetails }),
            ...(entity.driId !== undefined && { 'DRI': entity.driId }),
            ...(entity.driEmail !== undefined && { 'DRI Email': entity.driEmail }),
            ...(entity.status !== undefined && { 'Status': entity.status }),
            ...(entity.dueDate !== undefined && { 'Due date': entity.dueDate }),
        };
    }
 
}

const dasTaskService = new DASTaskService()
export { DASTaskService, dasTaskService };
export type { Task };

