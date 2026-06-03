/**
 *  addVolunteerToTeam.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { describe, expect, it, vi } from "vitest";
import { ProfileService } from "../services/dasProfileService";
import { VolunteerService } from "../services/dasVolunteerService";
import { deleteVolunteers } from "./DeleteVolunteers";
import { Volunteer } from "../services/dasVolunteerDao";
import { getCoreServices } from "@digitalaidseattle/core";

describe("deleteVolunteers", () => {

    it("basic", () => {
        const profileService = ProfileService.getInstance();
        const storageService = getCoreServices().storageService!;

        const ids = ['test_id'];
        const found = {
            id: "test_id",
            profile: {
                id: "profile_id",
                pic: "pic_location"
            }
        } as Volunteer;

        const getByIdSpy = vi.spyOn(VolunteerService.getInstance(), 'getById')
            .mockResolvedValue(found);
        const removeFileSpy = vi.spyOn(storageService, 'removeFile')
            .mockResolvedValue(found);
        const deleteVolunteerSpy = vi.spyOn(VolunteerService.getInstance(), 'delete')
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