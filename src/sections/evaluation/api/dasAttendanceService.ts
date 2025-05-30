/**
 *  dasMeetingService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { AirtableEntityService } from "@digitalaidseattle/airtable";
import { dasAirtableService } from "../../../services/airtableService";
import { FieldSet, Record } from "airtable";
import { dasAirtableClient } from "./airtableClient";
import { User } from "@digitalaidseattle/core";

const ATTENDANCE_TABLE = 'tblteoO3SNWzBpyfo';

type Attendance = {
    id: string
    meetingId: string[]
    internalAttendeeIds: string[]
    present: boolean
    absent: boolean
}

class DASAttendanceService extends AirtableEntityService<Attendance> {

    public constructor() {
        super(dasAirtableClient, ATTENDANCE_TABLE);
    }

    transform = (record: any): Attendance => {
        return {
            id: record.id,
            meetingId: record.fields['Meeting'],
            internalAttendeeIds: record.fields["Internal Attendee"],
            present: record.fields["Present"],
            absent: record.fields["Absent"],
        }
    }

    transformEntity(entity: Partial<Attendance>): Partial<FieldSet> {
        return {
            "Meeting": entity.meetingId,
            "Internal Attendee": entity.internalAttendeeIds,
            "Present": entity.present,
            "Absent": entity.absent,
        };
    }

    async findByMeetingId(meeting: string): Promise<Attendance[]> {
        const filter = `FIND('${meeting}', ARRAYJOIN({Meeting}))`
        // const filter = `${meeting} = {Meeting})`
        return super.getAll(undefined, filter)
    }

    // Overriding because component library is broken
    async batchInsert(entities: Partial<Attendance>[], _select?: string, _user?: User): Promise<Attendance[]> {
        return this.base(this.tableId)
            .create(entities.map(entity => {
                return { id: entity.id!.toString(), fields: this.transformEntity(entity) }
            }))
            .then(records => records.map(record => this.transform(record)));
    }
}

const dasAttendanceService = new DASAttendanceService();
export { dasAttendanceService };
export type { Attendance };

