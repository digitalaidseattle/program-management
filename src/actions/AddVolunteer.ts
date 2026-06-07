/**
 *  AddVolunteer.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */

import { Volunteer } from "../data/types";


export async function addVolunteer(_volunteer: Volunteer): Promise<Volunteer> {
    throw new Error('not ready')
    // const profileService = ProfileService.getInstance();

    //delete volunteers' profiles' pics and profiles
    // volunteer.profile!.name = `${volunteer.profile!.first_name} ${volunteer.profile!.last_name}`;
    // return profileService.insert(volunteer.profile!)
    //     .then(() => {
    //         delete volunteer.profile;
    //         return VolunteerService.getInstance().insert(volunteer)
    //     })
}