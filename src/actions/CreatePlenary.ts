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

    const nextTuesday = dayjs()
        .day(2)
        .set('hour', 18).set('minute', 0).set('second', 0)
        .toDate();

    const meeting: Meeting = {
        id: uuid(),
        name: 'Plenary',
        type: 'plenary',
        date: nextTuesday,
        meeting_url: 'https://meet.google.com/swr-ixuh-xdc',
        status: 'new',
        notes: '',
        team_id: '',
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

    await meetingService.insert(meeting);
    await meetingAttendeeService.batchInsert(attendees);
    return meetingService.getById(meeting.id)
}
