/**
 *  dasMeetingService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { dasAirtableService } from "../../../services/airtableService";
import { TaskGroup } from "./dasTaskGroupService";

const MEETING_TABLE = 'tblWwnZ8rjLFjQizJ';
const ATTENDANCE_TABLE = 'tblteoO3SNWzBpyfo';

// const MAX_RECORDS = 200;
// const FILTER = ``

type Attendance = {
    id: string
    meetingId: string[]
    internalAttendeeIds: string[]
    present: boolean
    absent: boolean
}

class DASAttendanceService {
    transform = (record: any): Attendance => {
        return {
            id: record.id,
            meetingId: record.fields['Meeting'],
            internalAttendeeIds: record.fields["Internal Attendee"],
            present: record.fields["Present"],
            absent: record.fields["Absent"],
        }
    }
    async create(fields: any): Promise<Attendance> {
        return dasAirtableService
            .base(ATTENDANCE_TABLE)
            .create([{ fields: fields }])
            .then((resp: any) => {
                if (resp.error) {
                    throw resp.error
                }
                return this.transform(resp[0])
            })
    }

    async createAttendances(attendances: any[]): Promise<Attendance> {
        return dasAirtableService
            .base(ATTENDANCE_TABLE)
            .create(attendances)
            .then((resp: any) => {
                if (resp.error) {
                    throw resp.error
                }
                return this.transform(resp[0])
            })
    }

    async findIds(ids: string[]): Promise<Attendance[]> {
        const filter = `OR(${ids.map(id => `{id} = "${id}"`).join(", ")})`;
        return dasAirtableService.getAll(ATTENDANCE_TABLE, filter)
            .then(records => records.map(r => this.transform(r)))
    }

    getById = async (id: string): Promise<any> => {
        return dasAirtableService.getRecord(ATTENDANCE_TABLE, id)
            .then(r => this.transform(r))
    }

    async findByMeetingId(meeting: string): Promise<Attendance[]> {
        const filter = `FIND('${meeting}', ARRAYJOIN({Meeting}))`
        // const filter = `${meeting} = {Meeting})`
        return dasAirtableService
            .getAll(ATTENDANCE_TABLE, filter)
            .then(records => records.map(r => this.transform(r)))
    }
}

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

class DASMeetingService {
    static TYPES = [
        "Plenary", "Leadership", "Team meeting", "Task Group", "Ad hoc", "Venture in Evaluation Task Group "
    ]
    static CREATION_TYPES = [
        " AirTable", "Gcal"
    ]
    static DURATIONS = [
        "25", "40", "50", "80"
    ]

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

    async create(fields: any): Promise<Meeting> {
        return dasAirtableService
            .base(MEETING_TABLE)
            .create([{ fields: fields }])
            .then((resp: any) => {
                if (resp.error) {
                    throw resp.error
                }
                return this.transform(resp[0])
            })
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

    async update(changes: { id: string; fields: any; }): Promise<Meeting> {
        return dasAirtableService
            .base(MEETING_TABLE)
            .update([changes])
            .then((resp: any) => {
                if (resp.error) {
                    throw resp.error
                }
                return this.transform(resp[0])
            })
    }

    async findAll(tg?: any): Promise<Meeting[]> {
        const filter = tg
            ? `AND(OR({type} = 'Task Group', {type} = 'Venture in Evaluation Task Group ') , FIND('${tg.taskGroupCode}', {Task Group discussed}))`
            : ''
        return dasAirtableService.getAll(MEETING_TABLE, filter)
            .then(records => records.map(r => this.transform(r)))
    }

}

const dasMeetingService = new DASMeetingService();
const dasAttendanceService = new DASAttendanceService();
export { dasAttendanceService, dasMeetingService, DASMeetingService };
export type { Meeting, Attendance };

