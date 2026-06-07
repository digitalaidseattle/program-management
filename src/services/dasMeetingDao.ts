/**
 *  dasMeetingDao.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { SupabaseConfiguration, SupabaseDAO } from "@digitalaidseattle/supabase";
import dayjs from "dayjs";
import { v4 as uuid } from 'uuid';
import { Profile } from "./dasProfileService";
import { Team } from "./dasTeamService";
import { Volunteer } from "./dasVolunteerService";

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
class MeetingDao extends SupabaseDAO<Meeting> {
    private static _instance: MeetingDao;

    static getInstance(): MeetingDao {
        if (!this._instance) {
            this._instance = new MeetingDao();
        }
        return this._instance;
    }

    public constructor() {
        super(SupabaseConfiguration.getInstance().getSupabaseClient(), "meeting", { select: MEETING_SELECT });
    }

    async findByAirtableId(airtableId: string): Promise<Meeting> {
        return await this.client
            .from(this.tableName)
            .select('*')
            .eq('airtable_id', airtableId)
            .single()
            .then((resp: any) => this.mapJson(resp.data));
    }

    async getCurrent(type: string): Promise<Meeting> {
        return await this.client
            .from(this.tableName)
            .select(MEETING_SELECT)
            .eq('type', type)
            .eq('status', 'new')
            .order('start_date', { ascending: false })
            .then((resp: any) => this.mapJson(resp.data[0]));
    }

    async findByMonth(month: Date): Promise<Meeting[]> {
        const start_date = dayjs(month).startOf('month');
        const end_date = start_date.add(1, 'month');
        return await this.client
            .from(this.tableName)
            .select(MEETING_SELECT)
            .gte('start_date', start_date.toISOString())
            .lt('start_date', end_date.toISOString())
            .then((resp: any) => resp.data.map((json: any) => this.mapJson(json)));
    }

}

class MeetingAttendeeDao extends SupabaseDAO<MeetingAttendee> {
    private static _instance: MeetingAttendeeDao;

    static getInstance(): MeetingAttendeeDao {
        if (!this._instance) {
            this._instance = new MeetingAttendeeDao();
        }
        return this._instance;
    }


    public constructor() {
        super(SupabaseConfiguration.getInstance().getSupabaseClient(), "meeting_attendee");
    }

    createFromVolunteer(volunteer: Volunteer, meeting: Meeting): MeetingAttendee {
        return ({
            id: uuid(),
            meeting_id: meeting.id,
            profile_id: volunteer.id,
            email: volunteer.das_email,
            status: 'unknown'
        });
    }

    async findByProfileId(id: string): Promise<MeetingAttendee[]> {
        return this.client
            .from(this.tableName)
            .select('*, meeting(*)')
            .eq('profile_id', id)
            .then((resp: any) => resp.data);
    }
}

class MeetingTopicDao extends SupabaseDAO<MeetingTopic> {

    private static _instance: MeetingTopicDao;

    static getInstance(): MeetingTopicDao {
        if (!this._instance) {
            this._instance = new MeetingTopicDao();
        }
        return this._instance;
    }

    public constructor() {
        super(SupabaseConfiguration.getInstance().getSupabaseClient(), "meeting_topic");
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
        return this.client
            .from(this.tableName)
            .select('*')
            .eq('type', 'intro')
            .then((resp: any) => resp.data);
    }

}


export { MeetingAttendeeDao, MeetingDao, MeetingTopicDao };
export type { Meeting, MeetingAttendee, MeetingTopic, MeetingType };

