/**
 *  dasVolunteerService.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Identifier, PageInfo, QueryModel } from "@digitalaidseattle/core";
import { SupabaseEntityService } from "@digitalaidseattle/supabase";
import { v4 as uuid } from 'uuid';
import {
    Meeting,
    MeetingAttendee,
    MeetingAttendeeDao,
    MeetingDao,
    MeetingTopic,
    MeetingTopicDao,
    MeetingType
} from "./dasMeetingDao";
import { Volunteer } from "./dasVolunteerService";

class MeetingService extends SupabaseEntityService<Meeting> {

    private static _instance: MeetingService;

    static getInstance(): MeetingService {
        if (!this._instance) {
            this._instance = new MeetingService();
        }
        return this._instance;
    }

    public constructor() {
        super(MeetingDao.getInstance());
    }

    getDao(): MeetingDao {
        return this.dao as MeetingDao;
    }

    async find(queryModel: QueryModel): Promise<PageInfo<Meeting>> {
        return this.getDao().find(queryModel);
    }

    async findByAirtableId(airtableId: string): Promise<Meeting> {
        return this.getDao().findByAirtableId(airtableId)
    }

    async getCurrent(type: string): Promise<Meeting> {
        return this.getDao().getCurrent(type);
    }

    async getById(entityId: Identifier, select?: string, mapper?: ((json: any) => Meeting) | undefined): Promise<Meeting | null> {
        return this.getDao().getById(entityId, { select: select, mapper: mapper });
    }

    async findByMonth(month: Date): Promise<Meeting[]> {
        return this.getDao().findByMonth(month);
    }

}

class MeetingAttendeeService extends SupabaseEntityService<MeetingAttendee> {
    private static _instance: MeetingAttendeeService;

    static getInstance(): MeetingAttendeeService {
        if (!this._instance) {
            this._instance = new MeetingAttendeeService();
        }
        return this._instance;
    }

    public constructor() {
        super(MeetingAttendeeDao.getInstance());
    }

    getDao(): MeetingAttendeeDao {
        return this.dao as MeetingAttendeeDao;
    }

    createFromVolunteer(volunteer: Volunteer, meeting: Meeting): MeetingAttendee {
        return this.getDao().createFromVolunteer(volunteer, meeting);
    }

    async findByProfileId(id: string): Promise<MeetingAttendee[]> {
        return this.getDao().findByProfileId(id);
    }
}

class MeetingTopicService extends SupabaseEntityService<MeetingTopic> {
    private static _instance: MeetingTopicService;

    static getInstance(): MeetingTopicService {
        if (!this._instance) {
            this._instance = new MeetingTopicService();
        }
        return this._instance;
    }

    public constructor() {
        super(MeetingTopicDao.getInstance());
    }

    getDao(): MeetingTopicDao {
        return this.dao as MeetingTopicDao;
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
        return this.findIntros();
    }

}

export { MeetingAttendeeService, MeetingService, MeetingTopicService };
export type { Meeting, MeetingAttendee, MeetingTopic, MeetingType };

