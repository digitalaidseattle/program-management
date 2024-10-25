/**
 *  dasTaskGroupService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { dasAirtableService } from "./airtableService";

const TASK_GROUP_TABLE = 'tblIDWTIHBu3XiuqW';
const TASK_DETAIL_TABLE = 'tblOku4Z4Fiqyx6S8';

type TaskGroup = {
    id: string,
    name: string,
    taskGroupCode: string,
    taskIds: string[],
    driveUrl: string,
    requestDetails: string,
    weeklyStatusSummary: string,
    responsibleIds: string[],
    ventureProductManagerIds: string[],
    ventureProjectManagerIds: string[],
    contributorPdMIds: string[],
    priority: string,
    status: string,
    partnerId: string,
    disciplinesRequiredId: string[]
}

class DASTaskGroupService {
    static TASK_GROUP_TABLE = 'tblIDWTIHBu3XiuqW';
    static TASK_DETAIL_TABLE = 'tblOku4Z4Fiqyx6S8';

    static STATUSES = [
        "Backlog",
        "Approved",
        "Delivered",
        "75% + nearly there",
        "<75% making progress",
        "<50% getting a footing",
        "<25% just started",
        "Abandoned",
        "Paused"
    ]

    static PRIORITIES = [
        "whenevs",
        "soon",
        "AAAAAAAA!!!!!"
    ]

    transform = (record: any): TaskGroup => {
        return {
            id: record.id,
            name: record.fields["Task Group name"],
            taskGroupCode: record.fields["Task group"],
            taskIds: record.fields["Tasks"],
            driveUrl: record.fields["Drive URL"],
            requestDetails: record.fields["Request details"],
            weeklyStatusSummary: record.fields["Weekly Status Summary"],
            responsibleIds: record.fields["Responsible"],
            ventureProductManagerIds: record.fields["Venture Product Manager"] ?? [],
            ventureProjectManagerIds: record.fields["Venture Project Manager"] ?? [],
            contributorPdMIds: record.fields["Contributor PdM"] ?? [],
            priority: record.fields["Priority"],
            status: record.fields["Status"],
            partnerId: record.fields["Partner"].length > 0 ? record.fields["Partner"][0] : "",
            disciplinesRequiredId: record.fields["Disciplines required"] ?? []
        }
    }

    getTasks = async (taskGroup: any): Promise<any> => {
        const FILTER = `FIND('${taskGroup.taskGroupCode}', ARRAYJOIN({Task Group}))`;
        return dasAirtableService
            .getAll(TASK_DETAIL_TABLE, FILTER)
            .then(records => {
                return records
                    .map(record => {
                        // console.log('getTasks', record.fields)
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
                    .sort((t1, t2) => t1.phase - t2.phase)
            })
    }

    getById = async (id: string): Promise<TaskGroup> => {
        return dasAirtableService
            .getRecord(TASK_GROUP_TABLE, id)
            .then(r => {
                const taskGroup = this.transform(r)
                return this.getTasks(taskGroup)
                    .then(tds => Object.assign(taskGroup, { tasks: tds }))
            })
    }


    update = async (changes: any): Promise<any> => {
        return dasAirtableService
            .base(TASK_GROUP_TABLE)
            .update([changes])
            .then((resp: any) => {
                if (resp.error) {
                    throw resp.error
                }
                return this.transform(resp[0])
            })
    }

}

const dasTaskGroupService = new DASTaskGroupService()
export { dasTaskGroupService, DASTaskGroupService };
export type { TaskGroup };

