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
import dayjs from "dayjs";

type MeetingAttendee = {
    id: string;
    meeting_id: string;
    meeting?: Meeting;
    profile_id: string;
    profile?: Profile;
    team_id?: string;  // leadership meeting
    team?: string;
    status: 'present' | 'absent' | 'unknown';
    email: string;
}

type MeetingTopic = {
    id: string,
    meeting_id: string;
    type: 'icebreaker' | 'shoutout' | 'team' | 'intro' | 'anniversary',
    subject_id: string[]; // ids for intro/anniversary/shoutouts
    subject: string; // alternate subject
    message: string;
    source: string; // who/team submitted it
    discussed: boolean;
}

type MeetingType = "adhoc" | "team" | "plenary" | "leadership";
type Meeting = {
    id: string;
    name: string;
    type: MeetingType;
    start_date: Date;
    end_date: Date;
    meeting_attendee?: MeetingAttendee[];
    meeting_topic?: MeetingTopic[];
    meeting_url: string;
    status: 'new' | 'concluded';
    notes: string;
    team_id?: string;
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

    async getCurrent(type: string): Promise<Meeting> {
        return await supabaseClient
            .from(this.tableName)
            .select(MEETING_SELECT)
            .eq('type', type)
            .eq('status', 'new')
            .order('start_date', { ascending: false })
            .then((resp: any) => resp.data[0]);
    }

    async getById(entityId: Identifier, select?: string): Promise<Meeting | null> {
        return super.getById(entityId, select ?? MEETING_SELECT)
    }

    async findByMonth(month: Date): Promise<Meeting[]> {
        const start_date = dayjs(month).startOf('month');
        const end_date = start_date.add(1, 'month');
        return await supabaseClient
            .from(this.tableName)
            .select(MEETING_SELECT)
            .gte('start_date', start_date.toISOString())
            .lt('start_date', end_date.toISOString())
            .then((resp: any) => resp.data);
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

    async findByProfileId(id: string): Promise<MeetingAttendee[]> {
        return supabaseClient
            .from(this.tableName)
            .select('*, meeting(*)')
            .eq('profile_id', id)
            .then((resp: any) => resp.data);
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
            subject_id: [], //deprecated
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
export type { Meeting, MeetingType, MeetingAttendee, MeetingTopic };

