/**
 *  RemoveContact.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { getCoreServices } from "@digitalaidseattle/core";
import { ProfileService } from "../services/dasProfileService";
import { VolunteerService } from "../services/dasVolunteerService";

export async function deleteVolunteers(ids: string[]): Promise<boolean> {
    const profileService = ProfileService.getInstance();
    const storageService = getCoreServices().storageService!;

    //delete volunteers' profiles' pics and profiles
    for (const id of ids) {
        const volunteer = await VolunteerService.getInstance().getById(id);
        if (volunteer) {
            await storageService.removeFile(volunteer.profile!.pic);
            await VolunteerService.getInstance().delete(volunteer.id);
            await profileService.delete(volunteer.profile!.id);
        }
    }
    return true;
}