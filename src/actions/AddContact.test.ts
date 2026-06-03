import { describe, expect, it, vi } from "vitest";
import { Contact, Partner, Profile2PartnerService } from "../services/dasPartnerService";
import { Profile, ProfileService } from "../services/dasProfileService";
import { addContact } from "./AddContact";
import { getCoreServices } from "@digitalaidseattle/core";

describe("AddContact", () => {

    vi.mock('../App', () => {
        return {
            storageService: {
                upload: vi.fn(),
            }
        }
    });

    // vi.mock('../services/profile2PartnerService', () => {
    //     return {
    //         profile2PartnerService: {
    //             insert: vi.fn(),
    //         }
    //     }
    // });

    it("basic", () => {
        const profileService = ProfileService.getInstance();
        const partner = { id: "partner_id" } as Partner;
        const contact = { id: "contact_id", title: "Senor" } as Contact;
        const picture = {} as File;
        const insertedContact = { id: "updated_id" } as Profile;
        const foundProfile = { id: "found_id" } as Profile;

        const getNextPicSpy = vi.spyOn(profileService, 'getNextPicUrl').mockReturnValue("picurl");
        const insertProfileSpy = vi.spyOn(profileService, 'insert').mockResolvedValue(insertedContact);
        const uploadSpy = vi.spyOn(getCoreServices().storageService!, 'upload');
        const uploadP2PSpy = vi.spyOn(Profile2PartnerService.getInstance(), 'insert');
        const getByIdSpy = vi.spyOn(profileService, 'getById').mockResolvedValue(foundProfile);

        addContact(partner, contact, picture)
            .then((actual) => {
                expect(getNextPicSpy).toBeCalledWith(contact);
                expect(insertProfileSpy).toBeCalledWith({ id: "contact_id", pic: "picurl" });
                expect(uploadSpy).toBeCalledWith("picurl", picture);
                expect(uploadP2PSpy).toBeCalledWith({
                    partner_id: "partner_id",
                    profile_id: "updated_id",
                    title: "Senor"
                });
                expect(getByIdSpy).toBeCalledWith("updated_id");
                expect(actual).toStrictEqual({ id: "found_id", title: "Senor" });
            });
    });

    it("no pic", () => {
        const profileService = ProfileService.getInstance();

        const partner = { id: "partner_id" } as Partner;
        const contact = { id: "contact_id", title: "Senor" } as Contact;
        const insertedContact = { id: "updated_id" } as Profile;
        const foundProfile = { id: "found_id" } as Profile;

        const insertProfileSpy = vi.spyOn(profileService, 'insert').mockResolvedValue(insertedContact);
        const uploadP2PSpy = vi.spyOn(Profile2PartnerService.getInstance(), 'insert');
        const getByIdSpy = vi.spyOn(profileService, 'getById').mockResolvedValue(foundProfile);

        addContact(partner, contact, undefined)
            .then((actual) => {
                expect(insertProfileSpy).toBeCalledWith({ id: "contact_id", pic: undefined });
                expect(uploadP2PSpy).toBeCalledWith({
                    partner_id: "partner_id",
                    profile_id: "updated_id",
                    title: "Senor"
                });
                expect(getByIdSpy).toBeCalledWith("updated_id");
                expect(actual).toStrictEqual({ id: "found_id", title: "Senor" });
            });
    });

});