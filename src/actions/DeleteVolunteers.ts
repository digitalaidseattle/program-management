/**
 *  RemoveContact.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { storageService } from "../App";
import { profileService } from "../services/dasProfileService";
import { volunteerService } from "../services/dasVolunteerService";

export async function deleteVolunteers(ids: string[]): Promise<boolean> {
    //delete volunteers' profiles' pics and profiles
    for (const id of ids) {
        const volunteer = await volunteerService.getById(id);
        if (volunteer) {
            await storageService.removeFile(volunteer.profile!.pic);
            await volunteerService.delete(volunteer.id);
            await profileService.delete(volunteer.profile!.id);
        }
    }
    return true;
}