/**
 *  UpdateContact.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { storageService } from "../App";
import { Contact, Partner, profile2PartnerService } from "../services/dasPartnerService";
import { profileService } from "../services/dasProfileService";

export async function updateContact(partner: Partner, contact: Contact, picture: File): Promise<Contact> {
    const filePath = picture ? profileService.getNextPicUrl(contact) : contact.pic;
    const upload = {
        ...contact,
        name: `${contact.first_name} ${contact.last_name}`,
        pic: filePath
    } as any;
    delete upload.title;

    console.log('updateContact upload', filePath, upload);

    await storageService.removeFile(contact.pic);
    const profile = await profileService.update(contact.id, upload);
    if (picture) {
        await storageService.upload(filePath, picture);
    }

    await profile2PartnerService.update(partner.id, profile.id, { title: contact.title });

    return profileService.getById(contact.id)
        .then(found => ({
            ...found,
            title: contact.title
        } as Contact))

}
