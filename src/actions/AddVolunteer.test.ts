import { describe, expect, it, vi } from "vitest";
import { Profile, profileService } from "../services/dasProfileService";
import { Volunteer, volunteerService } from "../services/dasVolunteerService";
import { addVolunteer } from "./AddVolunteer";

describe("addDisciplineToVolunteer", () => {

    it("basic", () => {
        const profile = {
            first_name: 'first',
            last_name: 'last',
        } as Profile;
        const volunteer = {
            id: "volunteer_id",
            profile: profile
        } as Volunteer;
        const insertedVolunteer = { id: "volunteer_id" } as Volunteer;
        const insertedProfile = { id: "volunteer_id" } as Profile;

        const insertProfileSpy = vi.spyOn(profileService, 'insert')
            .mockResolvedValue(insertedProfile);
        const insertVolunteerSpy = vi.spyOn(volunteerService, 'insert')
            .mockResolvedValue(insertedVolunteer);

        addVolunteer(volunteer)
            .then((actual) => {
                expect(insertProfileSpy).toBeCalledWith({
                    first_name: 'first',
                    last_name: 'last',
                    name: "first last"
                });
                expect(insertVolunteerSpy).toBeCalledWith(volunteer);

                expect(actual).toBe(insertedVolunteer)
            });
    });


});