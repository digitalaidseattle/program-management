/**
 *  RemoveContact.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { getCoreServices } from "@digitalaidseattle/core";
import { Contact } from "../services/dasPartnerService";
import { ProfileService } from "../services/dasProfileService";

export async function removeContact(contact: Contact): Promise<boolean> {
    const profileService = ProfileService.getInstance();
    const storageService = getCoreServices().storageService!;

    const filepath = profileService.getPicUrl(contact);
    if (filepath) {
        await storageService.removeFile(filepath)
    }
    return profileService.delete(contact.id)
        .then(() => true)
}
