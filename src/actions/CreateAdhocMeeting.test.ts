/**
 *  CreateAdhocMeeting.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { describe, expect, it, vi } from "vitest";
import { Meeting, MeetingAttendee, meetingAttendeeService, meetingService } from "../services/dasMeetingService";
import { Volunteer } from "../services/dasVolunteerService";
import { createAdhocMeeting } from "./CreateAdhocMeeting";

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
        const found = { } as Meeting;

        const insertMeetingSpy = vi.spyOn(meetingService, 'insert')
            .mockResolvedValue(inserted);
        const insertAttendeddSpy = vi.spyOn(meetingAttendeeService, 'insert')
            .mockResolvedValue(insertedAttendee);
        const getByIdSpy = vi.spyOn(meetingService, 'getById')
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