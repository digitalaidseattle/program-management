/**
 *  dasMeetingService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { dasAirtableService } from "./airtableService";

const MEETING_TABLE = 'tblWwnZ8rjLFjQizJ';

// const MAX_RECORDS = 200;
// const FILTER = ``

type Meeting = {
    id: string
    title: string
    taskGroupCode: string[]
    type: "Plenary" | "Leadership" | "Team meeting" | "Task Group" | "Ad hoc" | "Venture in Evaluation Task Group "
    createdVia: " AirTable" | "Gcal"
    purpose: string,
    topics: string,
    startDateTime: Date | undefined,
    duration: "25" | "40" | "50" | "80",
    attendees: string[],
    teamIds: string[],
    attendance: string[]
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

    newMeeting(): Meeting {
        return {
            id: "",
            title: "",
            taskGroupCode: [],
            type: "Venture in Evaluation Task Group ",
            createdVia: " AirTable",
            purpose: "",
            topics: "",
            startDateTime: new Date(),
            duration: "25",
            attendees: [],
            teamIds: [],
            attendance: []
        }
    }

    async create(fields: any): Promise<Meeting> {
        return dasAirtableService
            .base(MEETING_TABLE)
            .create([{ fields: fields }])
            .then((resp: any) => {
                console.log(resp)
                if (resp.error) {
                    throw resp.error
                }
                return this.transform(resp[0])
            })
    }

    transform = (record: any): Meeting => {
        return {
            id: record.id,
            title: record.fields['Meeting'],
            taskGroupCode: record.fields["Task group"],
            type: record.fields["type"],
            createdVia: record.fields["Created via"],
            purpose: record.fields["Meeting purpose"],
            topics: record.fields["Topics"],
            startDateTime: record.fields['Start Date/Time'] ? new Date(Date.parse(record.fields['Start Date/Time'] as string)) : undefined,
            duration: record.fields["Meeting duration in minutes"],
            attendees: (record.fields['Attendance names'] as string[]).filter(n => n),
            teamIds: record.fields['Team'],
            attendance: record.fields['Attendance']
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

    async findAll(tg?: any): Promise<any[]> {
        const filter = tg
            ? `AND(OR({type} = 'Task Group', {type} = 'Venture in Evaluation Task Group ') , FIND('${tg.taskGroupCode}', {Task Group discussed}))`
            : ''
        return dasAirtableService.getAll(MEETING_TABLE, filter)
            .then(records => records.map(r => this.transform(r)))

    }

}

const dasMeetingService = new DASMeetingService();
export { dasMeetingService, DASMeetingService };
export type { Meeting };

