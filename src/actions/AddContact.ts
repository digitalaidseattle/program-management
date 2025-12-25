/**
 *  AddContact.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { storageService } from "../App";
import { Contact, Partner, profile2PartnerService } from "../services/dasPartnerService";
import { profileService } from "../services/dasProfileService";

export async function addContact(partner: Partner, contact: Contact, picture: File | undefined): Promise<Contact> {
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

    await profile2PartnerService.insert(
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
