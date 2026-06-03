import { describe, expect, it, vi } from "vitest";
import { Profile, ProfileService } from "../services/dasProfileService";
import { VolunteerService } from "../services/dasVolunteerService";
import { addVolunteer } from "./AddVolunteer";
import { Volunteer } from "../services/dasVolunteerDao";

describe("addDisciplineToVolunteer", () => {

    it("basic", () => {
        const profileService = ProfileService.getInstance();

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
        const insertVolunteerSpy = vi.spyOn(VolunteerService.getInstance(), 'insert')
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