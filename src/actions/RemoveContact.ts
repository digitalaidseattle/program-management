/**
 *  RemoveContact.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { storageService } from "../App";
import { Contact } from "../services/dasPartnerService";
import { profileService } from "../services/dasProfileService";

export async function removeContact(contact: Contact): Promise<boolean> {
    const filepath = profileService.getPicUrl(contact);
    if (filepath) {
        await storageService.removeFile(filepath)
    }
    return profileService.delete(contact.id)
        .then(() => true)
}
