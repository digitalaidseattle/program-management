/**
 *  RemoveContact.tsx
 *
 *  @copyright 2025 Digital Aid Seattle
 *
 */


export async function deleteVolunteers(_ids: string[]): Promise<boolean> {
    // const profileService = ProfileService.getInstance();
    // const storageService = getCoreServices().storageService!;

    // //delete volunteers' profiles' pics and profiles
    // for (const id of ids) {
    //     const volunteer = await VolunteerService.getInstance().getById(id);
    //     if (volunteer) {
    //         await storageService.removeFile(volunteer.profile!.pic);
    //         await VolunteerService.getInstance().delete(volunteer.id);
    //         await profileService.delete(volunteer.profile!.id);
    //     }
    // }
    return true;
}