/**
 *  projectService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { dasAirtableService } from "./airtableService";

const TASK_GROUP_TABLE = 'tblIDWTIHBu3XiuqW';
const TASK_DETAIL_TABLE = 'tblOku4Z4Fiqyx6S8';

class DASTaskGroupService {
    getTasks = async (taskGroup: any): Promise<any> => {
 
        // REVIEW This should work, but doesn't
        // const FILTER = `FIND('${taskGroup.id}', ARRAYJOIN({Task Group}))`;
        const FILTER = `OR(${taskGroup.taskIds.map((tid:any) => `'${tid}' = {UID}`).join(', ')})`;
        return dasAirtableService
            .getAll(TASK_DETAIL_TABLE, FILTER)
            .then(records => {
                return records
                    .map(record => {
                        // console.log('getTasks', record.fields)
                        return {
                            id: record.id,
                            phase: record.fields['Phase'],
                            requestDetails: record.fields['Request Details'],
                        }
                    })
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
