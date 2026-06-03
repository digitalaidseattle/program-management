/**
 *  CreateAdhocMeeting.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { describe, expect, it, vi } from "vitest";
import { Meeting, MeetingAttendee, MeetingAttendeeService, MeetingService} from "../services/dasMeetingService";
import { createAdhocMeeting } from "./CreateAdhocMeeting";
import { Volunteer } from "../services/dasVolunteerDao";

describe("CreateAdhocMeeting", () => {
    it.beforeEach(() => {
        vi.resetAllMocks();
    })

    it("basic", () => {
        const volunteer = {
            id: "volunteer_id",
            profile: {
                id: "profile_id",

            },
            das_email: 'e@das.com'
        } as Volunteer;
        const insertedAttendee = {} as MeetingAttendee;
        const inserted = { id: "inserted_id" } as Meeting;
        const found = {} as Meeting;

        const insertMeetingSpy = vi.spyOn(MeetingService.getInstance(), 'insert')
            .mockResolvedValue(inserted);
        const insertAttendeddSpy = vi.spyOn(MeetingAttendeeService.getInstance(), 'insert')
            .mockResolvedValue(insertedAttendee);
        const getByIdSpy = vi.spyOn(MeetingService.getInstance(), 'getById')
            .mockResolvedValue(found);

        createAdhocMeeting(volunteer)
            .then((actual) => {
                expect(insertMeetingSpy).toBeCalledWith({
                    id: expect.any(String),
                    name: `Meeting`,
                    type: 'adhoc',
                    start_date: expect.any(Date),
                    end_date: expect.any(Date),
                    meeting_url: 'https://meet.google.com/swr-ixuh-xdc',
                    status: 'new',
                    notes: '',
                });
                expect(insertAttendeddSpy).toBeCalledWith({
                    email: "e@das.com",
                    id: expect.any(String),
                    meeting_id: expect.any(String),
                    profile_id: "profile_id",
                    status: "unknown",
                });
                expect(getByIdSpy).toBeCalledWith("inserted_id");
                expect(actual).toBe(found);
            });
    });

});