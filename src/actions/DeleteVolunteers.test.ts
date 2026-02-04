/**
 *  addVolunteerToTeam.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { describe, expect, it, vi } from "vitest";
import { storageService } from "../App";
import { profileService } from "../services/dasProfileService";
import { Volunteer, volunteerService } from "../services/dasVolunteerService";
import { deleteVolunteers } from "./DeleteVolunteers";

describe("deleteVolunteers", () => {

    it("basic", () => {
        const ids = ['test_id'];
        const found = {
            id: "test_id",
            profile: {
                id: "profile_id",
                pic: "pic_location"
            }
        } as Volunteer;

        const getByIdSpy = vi.spyOn(volunteerService, 'getById')
            .mockResolvedValue(found);
        const removeFileSpy = vi.spyOn(storageService, 'removeFile')
            .mockResolvedValue(found);
        const deleteVolunteerSpy = vi.spyOn(volunteerService, 'delete')
            .mockResolvedValue();
        const deleteProfileSpy = vi.spyOn(profileService, 'delete')
            .mockResolvedValue();

        deleteVolunteers(ids)
            .then((actual) => {
                expect(getByIdSpy).toBeCalledWith("test_id");
                expect(removeFileSpy).toBeCalledWith("pic_location");
                expect(deleteVolunteerSpy).toBeCalledWith("test_id");
                expect(deleteProfileSpy).toBeCalledWith("profile_id");
                expect(actual).toBe(true)
            });
    });

});