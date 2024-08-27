/**
 *  dasMeetingService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { FieldSet, Record } from "airtable";
import { dasAirtableService } from "./airtableService";

const MEETING_TABLE = 'tblWwnZ8rjLFjQizJ';

class DASMeetingService {

    transform(r: Record<FieldSet>): any {
        console.log(r)
        return {
            id: r.id,
            title: r.fields['Meeting'],
            meetingPurpose: r.fields['Meeting purpose'],
            startDateTime: r.fields['Start Date/Time'] ? new Date(Date.parse(r.fields['Start Date/Time'] as string)) : undefined,
            attendees: (r.fields['Attendance names'] as string[]).filter(n => n),
        }
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
export { dasMeetingService };

