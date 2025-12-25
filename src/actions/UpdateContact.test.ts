/**
 *  UpdateContact.test.ts
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { describe, expect, it, vi } from "vitest";
import { storageService } from "../App";
import { Contact, Partner, Profile2Partner, profile2PartnerService } from "../services/dasPartnerService";
import { Profile, profileService } from "../services/dasProfileService";
import { updateContact } from "./UpdateContact";

describe("UpdateContact", () => {

    it.beforeEach(() => {
        vi.resetAllMocks();
    })

    it("basic", () => {
        const partner = { id: "partner_id" } as Partner;
        const contact = {
            id: "contact_id",
            first_name: "first",
            last_name: "last",
            title: "TITLE",
            pic: "old_location"
        } as Contact;
        const file = {} as File;

        const updatedProfile = { id: "updated_profile" } as Profile;
        const updatedP2p = {} as Profile2Partner;
        const found = {} as Profile;

        const getPicUrlSpy = vi.spyOn(profileService, 'getNextPicUrl')
            .mockReturnValue('pic_location');
        const removeFileSpy = vi.spyOn(storageService, 'removeFile')
            .mockResolvedValue(true);
        const updateSpy = vi.spyOn(profileService, 'update')
            .mockResolvedValue(updatedProfile);
        const uploadSpy = vi.spyOn(storageService, 'upload')
            .mockResolvedValue(true);
        const updateP2pSpy = vi.spyOn(profile2PartnerService, 'update')
            .mockResolvedValue(updatedP2p);
        const getByIdSpy = vi.spyOn(profileService, 'getById')
            .mockResolvedValue(found);

        updateContact(partner, contact, file)
            .then(() => {
                expect(getPicUrlSpy).toBeCalledWith(contact);
                expect(removeFileSpy).toBeCalledWith("old_location");

                expect(updateSpy).toBeCalledWith("contact_id", {
                    id: "contact_id",
                    first_name: "first",
                    last_name: "last",
                    name: "first last",
                    pic: "pic_location"
                })
                expect(uploadSpy).toBeCalledWith("pic_location", file);
                expect(updateP2pSpy).toBeCalledWith("partner_id", "updated_profile", { title: "TITLE" });
                expect(getByIdSpy).toBeCalledWith("contact_id");
            });
    });

    it("no old pic", () => {
        const partner = { id: "partner_id" } as Partner;
        const contact = {
            id: "contact_id",
            first_name: "first",
            last_name: "last",
            title: "TITLE",
        } as Contact;
        const file = {} as File;

        const updatedProfile = { id: "updated_profile" } as Profile;
        const updatedP2p = {} as Profile2Partner;
        const found = {} as Profile;

        const getPicUrlSpy = vi.spyOn(profileService, 'getNextPicUrl')
            .mockReturnValue('pic_location');
        const removeFileSpy = vi.spyOn(storageService, 'removeFile')
            .mockResolvedValue(true);
        const updateSpy = vi.spyOn(profileService, 'update')
            .mockResolvedValue(updatedProfile);
        const uploadSpy = vi.spyOn(storageService, 'upload')
            .mockResolvedValue(true);
        const updateP2pSpy = vi.spyOn(profile2PartnerService, 'update')
            .mockResolvedValue(updatedP2p);
        const getByIdSpy = vi.spyOn(profileService, 'getById')
            .mockResolvedValue(found);

        updateContact(partner, contact, file)
            .then(() => {
                expect(getPicUrlSpy).toBeCalledWith(contact);
                expect(removeFileSpy).toBeCalledTimes(0);

                expect(updateSpy).toBeCalledWith("contact_id", {
                    id: "contact_id",
                    first_name: "first",
                    last_name: "last",
                    name: "first last",
                    pic: "pic_location"
                })
                expect(uploadSpy).toBeCalledWith("pic_location", file);
                expect(updateP2pSpy).toBeCalledWith("partner_id", "updated_profile", { title: "TITLE" });
                expect(getByIdSpy).toBeCalledWith("contact_id");
            });
    });

    it("no pic", () => {
        const partner = { id: "partner_id" } as Partner;
        const contact = {
            id: "contact_id",
            first_name: "first",
            last_name: "last",
            title: "TITLE",
        } as Contact;

        const updatedProfile = { id: "updated_profile" } as Profile;
        const updatedP2p = {} as Profile2Partner;
        const found = {} as Profile;

        const getPicUrlSpy = vi.spyOn(profileService, 'getNextPicUrl')
            .mockReturnValue('pic_location');
        const removeFileSpy = vi.spyOn(storageService, 'removeFile')
            .mockResolvedValue(true);
        const updateSpy = vi.spyOn(profileService, 'update')
            .mockResolvedValue(updatedProfile);
        const uploadSpy = vi.spyOn(storageService, 'upload')
            .mockResolvedValue(true);
        const updateP2pSpy = vi.spyOn(profile2PartnerService, 'update')
            .mockResolvedValue(updatedP2p);
        const getByIdSpy = vi.spyOn(profileService, 'getById')
            .mockResolvedValue(found);

        updateContact(partner, contact, undefined)
            .then(() => {
                expect(getPicUrlSpy).toBeCalledTimes(0);
                expect(removeFileSpy).toBeCalledTimes(0);

                expect(updateSpy).toBeCalledWith("contact_id", {
                    id: "contact_id",
                    first_name: "first",
                    last_name: "last",
                    name: "first last"
                })
                expect(uploadSpy).toBeCalledTimes(0);
                expect(updateP2pSpy).toBeCalledWith("partner_id", "updated_profile", { title: "TITLE" });
                expect(getByIdSpy).toBeCalledWith("contact_id");
            });
    });

});