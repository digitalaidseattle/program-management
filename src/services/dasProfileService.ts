/**
 *  dasProfileService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";
import { storageService } from "../App";


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
const DEFAULT_SELECT = "*";
class ProfileService extends SupabaseEntityService<Profile> {

    public constructor() {
        super("profile");
    }

    async findByEmail(email: string): Promise<Profile> {
        return await supabaseClient
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .ilike('email', email.toLowerCase())
            .single()
            .then((resp: any) => resp.data);
    }

    async findByName(name: string): Promise<Profile> {
        return await supabaseClient
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq('name', name)
            .single()
            .then((resp: any) => resp.data);
    }

    getPicUrl(profile: Profile): string | undefined {
        return storageService.getUrl(`profiles/${profile.id}`);
    }
}

const profileService = new ProfileService();

export { profileService };
export type { Profile };

