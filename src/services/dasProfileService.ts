/**
 *  dasProfileService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { SupabaseEntityService } from "@digitalaidseattle/supabase";


type Profile = {
    id: string,
    name: string,
    first_name: string,
    last_name: string,
    email: string,
    phone: string,
    location: string,
    pic: string
}

class ProfileService extends SupabaseEntityService<Profile> {
    public constructor() {
        super("profile");
    }
}

const profileService = new ProfileService();

export { profileService };
export type { Profile };

