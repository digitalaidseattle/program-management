/**
 *  CreatePlenary.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';
import { Meeting, MeetingAttendee, meetingAttendeeService, meetingService } from "../services/dasMeetingService";
import { Team } from '../services/dasTeamService';

export async function createTeamMeeting(team: Team): Promise<Meeting | null> {

    // TODO
    // check previous team meeting move unviewed topics
    // advance date by a week

    const startTime = dayjs()
        .set('hour', 18).set('minute', 0).set('second', 0);

    const meeting: Meeting = {
        id: uuid(),
        name: `${team.name} Team Meeting`,
        type: 'team',
        start_date: startTime.toDate(),
        end_date: startTime.add(50, 'm').toDate(),
        meeting_url: 'https://meet.google.com/swr-ixuh-xdc',
        status: 'new',
        notes: '',
        team_id: team.id,
    }

    const attendees = team.volunteer!
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
