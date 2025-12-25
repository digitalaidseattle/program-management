/**
 *  CreatePlenary.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { v4 as uuid } from 'uuid';
import { Meeting, MeetingAttendee, meetingAttendeeService, meetingService } from "../services/dasMeetingService";
import { volunteerService } from "../services/dasVolunteerService";
import dayjs from 'dayjs';

export async function createPlenaryMeeting(): Promise<Meeting | null> {

    // TODO
    // check previous plenary meeting move unviewed topics/intros/anniversaries.
    // add new intros
    // add new anniversaries

    const startTime = dayjs()
        .day(2)
        .set('hour', 18).set('minute', 0).set('second', 0);

    const meeting: Meeting = {
        id: uuid(),
        name: 'Plenary',
        type: 'plenary',
        start_date: startTime.toDate(),
        end_date: startTime.add(50, 'm').toDate(),
        meeting_url: 'https://meet.google.com/swr-ixuh-xdc',
        status: 'new',
        notes: '',
        team_id: undefined
    }

    const volunteers = await volunteerService.getActive()
    const attendees = volunteers.filter(v => v.status === 'Cadre')
        .map(v => ({
            id: uuid(),
            meeting_id: meeting.id,
            profile_id: v.profile!.id,
            status: 'unknown',
            email: v.das_email,
        } as MeetingAttendee))

    const inserted = await meetingService.insert(meeting);
    await meetingAttendeeService.batchInsert(attendees);
    return meetingService.getById(inserted.id)
}
