/**
 *  CreateAdhocMeeting.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';
import { Meeting, MeetingAttendee, meetingAttendeeService, meetingService } from "../services/dasMeetingService";
import { Volunteer } from '../services/dasVolunteerService';

export async function createAdhocMeeting(volunteer: Volunteer): Promise<Meeting | null> {

    const startTime = dayjs()
        .set('minute', 0)
        .set('second', 0);

    const meeting: Meeting = {
        id: uuid(),
        name: `Meeting`,
        type: 'adhoc',
        start_date: startTime.toDate(),
        end_date: startTime.add(25, 'm').toDate(),
        meeting_url: 'https://meet.google.com/swr-ixuh-xdc',
        status: 'new',
        notes: '',
    }

    const attendee = ({
        id: uuid(),
        meeting_id: meeting.id,
        profile_id: volunteer.profile!.id,
        status: 'unknown',
        email: volunteer.das_email,
    } as MeetingAttendee);

    const inserted = await meetingService.insert(meeting);
    await meetingAttendeeService.insert(attendee);
    return meetingService.getById(inserted.id)
}
