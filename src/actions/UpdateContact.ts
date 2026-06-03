/**
 *  UpdateContact.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { getCoreServices } from "@digitalaidseattle/core";
import { Contact, Partner, Profile2PartnerService } from "../services/dasPartnerService";
import { ProfileService } from "../services/dasProfileService";

export async function updateContact(partner: Partner, contact: Contact, picture: File | undefined): Promise<Contact> {
    const profileService = ProfileService.getInstance();
    const storageService = getCoreServices().storageService!;

    const filePath = picture ? profileService.getNextPicUrl(contact) : contact.pic;
    const upload = {
        ...contact,
        name: `${contact.first_name} ${contact.last_name}`,
        pic: filePath
    } as any;
    delete upload.title;

    if (picture && contact.pic) {
        await storageService.removeFile(contact.pic);
    }

    const profile = await profileService.update(contact.id, upload);
    if (picture) {
        await storageService.upload(filePath, picture);
    }

    await Profile2PartnerService.getInstance().update(partner.id, profile.id, { title: contact.title });

    return profileService.getById(contact.id)
        .then(found => ({
            ...found,
            title: contact.title
        } as Contact))

}
