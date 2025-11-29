/**
 *  AddContact.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { storageService } from "../App";
import { Contact, Partner, profile2PartnerService } from "../services/dasPartnerService";
import { profileService } from "../services/dasProfileService";

export async function addContact(partner: Partner, contact: Contact, picture: File): Promise<Contact> {
    // insert profile
    // insert picture
    // insert partner2profile
    // 
    const filePath = `/profiles/${contact.id}`;
    const upload = { ...contact } as any;
    upload.pic = filePath;
    delete upload.title;

    console.log(partner, filePath, upload)
    // const profile = await profileService.insert(upload);
    // await storageService.upload(filePath, picture);
    // await profile2PartnerService.insert(
    //     {
    //         partner_id: partner.id,
    //         profile_id: profile.id,
    //         title: contact.title
    //     }
    // );

    return profileService.getById(contact.id)
        .then(found => ({
            ...found,
            title: contact.title
        } as Contact))

}
