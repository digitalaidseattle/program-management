/**
 *  AddVolunteer.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { ProfileService } from "../services/dasProfileService";
import { Volunteer } from "../services/dasVolunteerDao";
import { VolunteerService } from "../services/dasVolunteerService";

export async function addVolunteer(volunteer: Volunteer): Promise<Volunteer> {
    const profileService = ProfileService.getInstance();

    //delete volunteers' profiles' pics and profiles
    volunteer.profile!.name = `${volunteer.profile!.first_name} ${volunteer.profile!.last_name}`;
    return profileService.insert(volunteer.profile!)
        .then(() => {
            delete volunteer.profile;
            return VolunteerService.getInstance().insert(volunteer)
        })
}