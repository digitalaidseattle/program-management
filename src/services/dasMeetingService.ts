/**
 *  dasVolunteerService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";
import { Profile } from "./dasProfileService";
import { Identifier } from "@digitalaidseattle/core";
import { v4 as uuid } from 'uuid';
import { Volunteer } from "./dasVolunteerService";
import { Team } from "./dasTeamService";

type MeetingAttendee = {
    id: string;
    meeting_id: string;
    profile_id: string;
    profile?: Profile;
    status: 'present' | 'absent' | 'unknown';
    email: string;
}

type MeetingTopic = {
    id: string,
    meeting_id: string;
    type: 'icebreaker' | 'shoutout' | 'team' | 'intro' | 'anniversary',
    subject_id: string[]; // ids for intro/anniversary/shoutouts
    subject: string; // alertnate subject
    message: string;
    source: string; // who/team submitted it
    discussed: boolean;
}

type Meeting = {
    id: string;
    name: string;
    type: 'plenary' | 'leadership' | 'team' | 'adhoc';
    date: Date;
    meeting_attendee?: MeetingAttendee[];
    meeting_topic?: MeetingTopic[];
    meeting_url: string;
    status: 'new' | 'concluded';
    notes: string;
    team_id: string;
    team?: Team;
}

const MEETING_SELECT = '*, meeting_attendee(*, profile(*)), meeting_topic(*)';
class MeetingService extends SupabaseEntityService<Meeting> {
    public constructor() {
        super("meeting");
    }

    async findByAirtableId(airtableId: string): Promise<Meeting> {
        return await supabaseClient
            .from(this.tableName)
            .select('*')
            .eq('airtable_id', airtableId)
            .single()
            .then((resp: any) => resp.data);
    }

    async getCurrentPlenary(): Promise<Meeting> {
        return await supabaseClient
            .from(this.tableName)
            .select(MEETING_SELECT)
            .eq('type', 'plenary')
            .eq('status', 'new')
            .single()
            .then((resp: any) => resp.data);
    }

    async getById(entityId: Identifier, select?: string): Promise<Meeting | null> {
        return super.getById(entityId, select ?? MEETING_SELECT)
    }

}

class MeetingAttendeeService extends SupabaseEntityService<MeetingAttendee> {

    public constructor() {
        super("meeting_attendee");
    }

    createFromVolunteer(volunteer: Volunteer, meeting: Meeting): MeetingAttendee {
        return ({
            id: uuid(),
            meeting_id: meeting.id,
            profile_id: volunteer.profile!.id,
            email: volunteer.das_email,
            status: 'unknown'
        });
    }
}

class MeetingTopicService extends SupabaseEntityService<MeetingTopic> {

    public constructor() {
        super("meeting_topic");
    }

    empty(meetingId: string): MeetingTopic {
        return {
            id: uuid(),
            meeting_id: meetingId,
            type: 'team',
            subject_id: [],
            subject: '',
            message: '',
            source: '', 
            discussed: false
        }
    }

    async findIntros(): Promise<MeetingTopic[]> {
        return supabaseClient
            .from(this.tableName)
            .select('*')
            .eq('type', 'intro')
            .then((resp: any) => resp.data);
    }

}

const meetingService = new MeetingService();
const meetingAttendeeService = new MeetingAttendeeService();
const meetingTopicService = new MeetingTopicService();

export { meetingService, meetingAttendeeService, meetingTopicService };
export type { Meeting, MeetingAttendee, MeetingTopic };

