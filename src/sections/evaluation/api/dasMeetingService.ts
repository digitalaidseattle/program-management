/**
 *  dasMeetingService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { AirtableEntityService } from "@digitalaidseattle/airtable";
import { FieldSet } from "airtable";
import { dasAirtableClient } from "./airtableClient";
import { Attendance } from "./dasAttendanceService";
import { TaskGroup } from "./dasTaskGroupService";

const MEETING_TABLE = 'tblWwnZ8rjLFjQizJ';

type Meeting = {
    id: string
    title: string
    taskGroupIds: string[]
    type: "Plenary" | "Leadership" | "Team meeting" | "Task Group" | "Ad hoc" | "Venture in Evaluation Task Group "
    createdVia: " AirTable" | "Gcal"
    purpose: string,
    topics: string,
    startDateTime: Date | undefined,
    duration: "25" | "40" | "50" | "80",
    attendees: string[],
    teamIds: string[],
    attendanceIds: string[],
    attendances: Attendance[]
}

class DASMeetingService extends AirtableEntityService<Meeting> {


    static TYPES = [
        "Plenary", "Leadership", "Team meeting", "Task Group", "Ad hoc", "Venture in Evaluation Task Group "
    ]
    static CREATION_TYPES = [
        " AirTable", "Gcal"
    ]
    static DURATIONS = [
        "25", "40", "50", "80"
    ]

    public constructor() {
        super(dasAirtableClient, MEETING_TABLE);
    }

    createAttendances(taskGroup: TaskGroup): Attendance[] {
        const attendancesIds: Set<string> = new Set();
        taskGroup.responsibleIds.forEach(id => attendancesIds.add(id));
        taskGroup.ventureProductManagerIds.forEach(id => attendancesIds.add(id));
        taskGroup.ventureProjectManagerIds.forEach(id => attendancesIds.add(id));
        taskGroup.contributorPdMIds.forEach(id => attendancesIds.add(id));
        return Array.from(attendancesIds).map(id => {
            return {
                internalAttendeeIds: [id]
            } as Attendance
        });
    }

    newMeeting(): Meeting {
        return {
            id: "",
            title: "",
            taskGroupIds: [],
            type: "Venture in Evaluation Task Group ",
            createdVia: " AirTable",
            purpose: "",
            topics: "",
            startDateTime: new Date(),
            duration: "25",
            attendees: [],
            teamIds: [],
            attendanceIds: [],
            attendances: []
        }
    }

    transform(record: any): Meeting {
        return {
            id: record.id,
            title: record.fields['Meeting'],
            taskGroupIds: record.fields["Task Group discussed"],
            type: record.fields["type"],
            createdVia: record.fields["Created via"],
            purpose: record.fields["Meeting purpose"],
            topics: record.fields["Topics"],
            startDateTime: record.fields['Start Date/Time'] ? new Date(Date.parse(record.fields['Start Date/Time'] as string)) : undefined,
            duration: record.fields["Meeting duration in minutes"],
            attendees: (record.fields['Attendance names'] as string[]).filter(n => n),
            teamIds: record.fields['Team'],
            attendanceIds: record.fields['Attendance'],
            // TODO need to lookup attendance 
            attendances: []
        }
    }
    transformEntity(entity: Partial<Meeting>): Partial<FieldSet> {
        // Converts a Meeting entity to Airtable field set for create/update
        return {
            "Meeting": entity.title,
            "Task Group discussed": entity.taskGroupIds,
            "type": entity.type,
            "Created via": entity.createdVia,
            "Meeting purpose": entity.purpose,
            "Topics": entity.topics,
            "Start Date/Time": entity.startDateTime ? entity.startDateTime.toISOString() : undefined,
            "Meeting duration in minutes": entity.duration,
            "Attendance names": entity.attendees,
            "Team": entity.teamIds,
            "Attendance": entity.attendanceIds
        };
    }

    // async update(changes: { id: string; fields: any; }): Promise<Meeting> {
    //     return dasAirtableService
    //         .base(MEETING_TABLE)
    //         .update([changes])
    //         .then((resp: any) => {
    //             if (resp.error) {
    //                 throw resp.error
    //             }
    //             return this.transform(resp[0])
    //         })
    // }

    async findAll(tg?: any): Promise<Meeting[]> {
        const filter = tg
            ? `AND(OR({type} = 'Task Group', {type} = 'Venture in Evaluation Task Group ') , FIND('${tg.taskGroupCode}', {Task Group discussed}))`
            : '';
        return super.getAll(undefined, filter);
    }

}

const dasMeetingService = new DASMeetingService();
export { dasMeetingService, DASMeetingService };
export type { Meeting };

