/**
 *  AddContact.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { getCoreServices } from "@digitalaidseattle/core";
import { Contact, Partner, Profile2PartnerService } from "../services/dasPartnerService";
import { ProfileService } from "../services/dasProfileService";

export async function addContact(partner: Partner, contact: Contact, picture: File | undefined): Promise<Contact> {
    const profileService = ProfileService.getInstance();
    const storageService = getCoreServices().storageService!
    // insert profile
    // insert picture
    // insert partner2profile
    // 
    const filePath = picture ? profileService.getNextPicUrl(contact) : undefined;
    const upload = {
        ...contact,
        pic: filePath
    } as any;

    delete upload.title;

    const profile = await profileService.insert(upload);
    if (picture && filePath) {
        await storageService.upload(filePath, picture);
    }

    await Profile2PartnerService.getInstance().insert(
        {
            partner_id: partner.id,
            profile_id: profile.id,
            title: contact.title
        }
    );

    return profileService.getById(profile.id)
        .then(found => ({
            ...found,
            title: contact.title
        } as Contact))

}
