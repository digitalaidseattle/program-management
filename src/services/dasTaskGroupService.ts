/**
 *  projectService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { dasAirtableService } from "./airtableService";

const TASK_GROUP_TABLE = 'tblIDWTIHBu3XiuqW';
const TASK_DETAIL_TABLE = 'tblOku4Z4Fiqyx6S8';

type Task = {
    id: string;
    title: string;
    phase: number;
    requestDetails: string;
    driId: string;
    driEmail: string;
    status: string;
}
class DASTaskGroupService {
    getTasks = async (taskGroup: any): Promise<any> => {

        // REVIEW This should work, but doesn't
        // const FILTER = `FIND('${taskGroup.id}', ARRAYJOIN({Task Group}))`;
        const FILTER = `OR(${taskGroup.taskIds.map((tid: any) => `'${tid}' = {UID}`).join(', ')})`;
        return dasAirtableService
            .getAll(TASK_DETAIL_TABLE, FILTER)
            .then(records => {
                return records
                    .map(record => {
                        console.log('getTasks', record.fields)
                        return {
                            id: record.id,
                            title: record.fields['The request'],
                            phase: Number.parseInt(record.fields['Phase'] as string),
                            requestDetails: record.fields['Request Details'],
                            driId: record.fields['DRI'],
                            driEmail: record.fields['DRI Email'],
                            status: record.fields['Status']
                        } as Task
                    })
                    .sort((t1, t2) => t1.phase - t2.phase)
            })
    }

    getById = async (id: string): Promise<any> => {
        return dasAirtableService
            .getRecord(TASK_GROUP_TABLE, id)
            .then(r => {
                console.log('getById', r)
                const taskGroup = {
                    id: r.id,
                    name: r.fields["Task Group name"],
                    taskIds: r.fields["Tasks"],
                    driveUrl: r.fields["Drive URL"],
                    requestDetails: r.fields["Request details"],
                }
                return this.getTasks(taskGroup)
                    .then(tds => Object.assign(taskGroup, { tasks: tds }))

            })
    }

}

const dasTaskGroupService = new DASTaskGroupService()
export { dasTaskGroupService };
export type { Task }