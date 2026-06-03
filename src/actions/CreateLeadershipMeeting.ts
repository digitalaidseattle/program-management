/**
 *  CreatePlenary.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';
import { Meeting, MeetingAttendee, MeetingAttendeeService, MeetingService } from "../services/dasMeetingService";
import { Team2VolunteerService } from '../services/dasTeam2VolunteerService';

export async function createLeadershipMeeting(): Promise<Meeting | null> {

    // TODO
    // check previous team meeting move unviewed topics
    // advance date by a week

    const startTime = dayjs()
        .set('hour', 18).set('minute', 0).set('second', 0);

    const meeting: Meeting = {
        id: uuid(),
        name: `Leadership`,
        type: 'leadership',
        start_date: startTime.toDate(),
        end_date: startTime.add(50, 'm').toDate(),
        meeting_url: 'https://meet.google.com/swr-ixuh-xdc',
        status: 'new',
        notes: ''
    }

    const leaders = await Team2VolunteerService.getInstance().findLeaders();
    const attendees = leaders
        .map(t2v => ({
            id: uuid(),
            meeting_id: meeting.id,
            profile_id: t2v.volunteer!.profile!.id,
            status: 'unknown',
            email: t2v.volunteer!.das_email,
            team_id: t2v.team_id
        } as MeetingAttendee))

    await MeetingService.getInstance().insert(meeting);
    await MeetingAttendeeService.getInstance().batchInsert(attendees);
    return MeetingService.getInstance().getById(meeting.id)
}
