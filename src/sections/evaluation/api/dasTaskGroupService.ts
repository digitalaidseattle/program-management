/**
 *  dasTaskGroupService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { AirtableEntityService } from "@digitalaidseattle/airtable";
import Airtable from "airtable";
import { dasTaskService } from "./dasTaskService";
import { dasAirtableClient } from "../../../services/airtableClient";

const TASK_GROUP_TABLE = 'tblIDWTIHBu3XiuqW';

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

class DASTaskGroupService extends AirtableEntityService<TaskGroup> {

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

    public constructor() {
        super(dasAirtableClient, TASK_GROUP_TABLE);
    }

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

    transformEntity(entity: Partial<TaskGroup>): Partial<Airtable.FieldSet> {
        return {
            "Task Group name": entity.name,
            "Task group": entity.taskGroupCode,
            "Tasks": entity.taskIds,
            "Drive URL": entity.driveUrl,
            "Request details": entity.requestDetails,
            "Weekly Status Summary": entity.weeklyStatusSummary,
            "Responsible": entity.responsibleIds,
            "Venture Product Manager": entity.ventureProductManagerIds,
            "Venture Project Manager": entity.ventureProjectManagerIds,
            "Contributor PdM": entity.contributorPdMIds,
            "Priority": entity.priority,
            "Status": entity.status,
            "Partner": entity.partnerId ? [entity.partnerId] : [],
            "Disciplines required": entity.disciplinesRequiredId
        };
    }

    getTasks = async (taskGroup: any): Promise<any> => {
        const FILTER = `FIND('${taskGroup.taskGroupCode}', ARRAYJOIN({Task Group}))`;
        return dasTaskService
            .getAll(undefined, FILTER)
            .then(tasks => tasks.sort((t1, t2) => t1.phase - t2.phase))

    }

    getById = async (id: string): Promise<TaskGroup> => {
        return super.getById(id)
            .then(taskGroup =>
                this.getTasks(taskGroup)
                    .then(tds => Object.assign(taskGroup, { tasks: tds }))
            )
    }

}

const dasTaskGroupService = new DASTaskGroupService()
export { dasTaskGroupService, DASTaskGroupService };
export type { TaskGroup };

