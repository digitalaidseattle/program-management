/**
 *  CreatePlenary.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';
import { Meeting, MeetingAttendee, meetingAttendeeService, meetingService } from "../services/dasMeetingService";
import { team2VolunteerService } from '../services/dasTeam2VolunteerService';

export async function createLeadershipMeeting(): Promise<Meeting | null> {

    // TODO
    // check previous team meeting move unviewed topics
    // advance date by a week

    const nextMeeting = dayjs()
        .set('hour', 18).set('minute', 0).set('second', 0)
        .toDate();

    const meeting: Meeting = {
        id: uuid(),
        name: `Leadership   `,
        type: 'leadership',
        date: nextMeeting,
        meeting_url: 'https://meet.google.com/swr-ixuh-xdc',
        status: 'new',
        notes: ''
    }

    const leaders = await team2VolunteerService.findLeaders();
    console.log(leaders)
    const attendees = leaders
        .map(t2v => ({
            id: uuid(),
            meeting_id: meeting.id,
            profile_id: t2v.volunteer!.profile!.id,
            status: 'unknown',
            email: t2v.volunteer!.das_email,
            team_id: t2v.team_id
        } as MeetingAttendee))

    await meetingService.insert(meeting);
    await meetingAttendeeService.batchInsert(attendees);
    return meetingService.getById(meeting.id)
}
