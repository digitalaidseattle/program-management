/**
 *  CreateTeamMeeting.test.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { describe, expect, it, vi } from "vitest";
import { Meeting, MeetingAttendee, meetingAttendeeService, meetingService } from "../services/dasMeetingService";
import { Volunteer, volunteerService } from "../services/dasVolunteerService";
import { createPlenaryMeeting } from "./CreatePlenary";
import { createTeamMeeting } from "./CreateTeamMeeting";
import { Team } from "../services/dasTeamService";

describe("CreateTeamMeeting", () => {
    it.beforeEach(() => {
        vi.resetAllMocks();
    })

    it("basic", () => {
        const team = {
            name: 'HR',
            volunteer: [
                {
                    id: "volunteer_id",
                    status: 'Cadre',
                    profile_id: 'profile_id',
                    profile: {
                        id: 'profile_id',
                    },
                    das_email: "e@das.com"
                }
            ]
        } as Team;
        const insertedAttendee = {} as MeetingAttendee;
        const inserted = { id: "inserted_id" } as Meeting;
        const found = {} as Meeting;
        const insertMeetingSpy = vi.spyOn(meetingService, 'insert')
            .mockResolvedValue(inserted);
        const insertAttendeeSpy = vi.spyOn(meetingAttendeeService, 'batchInsert')
            .mockResolvedValue([insertedAttendee]);
        const getByIdSpy = vi.spyOn(meetingService, 'getById')
            .mockResolvedValue(found);

        createTeamMeeting(team)
            .then((actual) => {
                expect(insertMeetingSpy).toBeCalledWith({
                    id: expect.any(String),
                    name: `HR Team Meeting`,
                    type: 'team',
                    start_date: expect.any(Date),
                    end_date: expect.any(Date),
                    meeting_url: 'https://meet.google.com/swr-ixuh-xdc',
                    status: 'new',
                    notes: '',
                });
                expect(insertAttendeeSpy).toBeCalledWith([{
                    email: "e@das.com",
                    id: expect.any(String),
                    meeting_id: expect.any(String),
                    profile_id: "profile_id",
                    status: "unknown",
                }]);
                expect(getByIdSpy).toBeCalledWith("inserted_id");
                expect(actual).toBe(found);
            });
    });

});