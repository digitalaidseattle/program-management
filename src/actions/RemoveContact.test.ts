/**
 *  removeContact.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { describe, expect, it, vi } from "vitest";
import { Contact } from "../services/dasPartnerService";
import { ProfileService } from "../services/dasProfileService";
import { removeContact } from "./RemoveContact";
import { getCoreServices } from "@digitalaidseattle/core";

describe("removeContact", () => {
    const profileService = ProfileService.getInstance();
    const storageService = getCoreServices().storageService!;

    it.beforeEach(() => {
        vi.resetAllMocks();
    })

    it("basic", () => {

        const contact = {
            id: "contact_id"
        } as Contact;

        const getPicUrlSpy = vi.spyOn(profileService, 'getPicUrl')
            .mockReturnValue('pic_location');
        const removeFileSpy = vi.spyOn(storageService, 'removeFile')
            .mockResolvedValue(true);
        const deleteProfileSpy = vi.spyOn(profileService, 'delete')
            .mockResolvedValue();

        removeContact(contact)
            .then(() => {
                expect(getPicUrlSpy).toBeCalledWith(contact);
                expect(removeFileSpy).toBeCalledWith("pic_location");
                expect(deleteProfileSpy).toBeCalledWith("contact_id");
            });
    });

    it("no pic", () => {
        const contact = {
            id: "contact_id"
        } as Contact;

        const getPicUrlSpy = vi.spyOn(profileService, 'getPicUrl')
            .mockReturnValue(undefined);
        const removeFileSpy = vi.spyOn(storageService, 'removeFile')
            .mockResolvedValue(true);
        const deleteProfileSpy = vi.spyOn(profileService, 'delete')
            .mockResolvedValue();

        removeContact(contact)
            .then(() => {
                expect(getPicUrlSpy).toBeCalledTimes(1);
                expect(getPicUrlSpy).toBeCalledWith(contact);
                expect(removeFileSpy).toBeCalledTimes(0);
                expect(deleteProfileSpy).toBeCalledWith("contact_id");
            });
    });


});