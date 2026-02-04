/**
 *  AddVolunteer.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { profileService } from "../services/dasProfileService";
import { Volunteer, volunteerService } from "../services/dasVolunteerService";

export async function addVolunteer(volunteer: Volunteer): Promise<Volunteer> {
    //delete volunteers' profiles' pics and profiles
    volunteer.profile!.name = `${volunteer.profile!.first_name} ${volunteer.profile!.last_name}`;
    return profileService.insert(volunteer.profile!)
        .then(() => {
            delete volunteer.profile;
            return volunteerService.insert(volunteer)
        })
}