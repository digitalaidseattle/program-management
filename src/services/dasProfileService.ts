/**
 *  dasProfileService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { v4 as uuid } from 'uuid';

import { supabaseClient, SupabaseEntityService } from "@digitalaidseattle/supabase";
import { storageService } from "../App";


type Profile = {
    id: string;
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
    empty(): Profile {
        return ({
            id: uuid(),
            name: '',
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            location: '',
            pic: ''
        })
    }

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
        // FIXME: migrate url to pic attribute
        return profile.pic ? storageService.getUrl(`/profiles/${profile.id}`) : undefined;
        // return profile.pic ? storageService.getUrl(profile.pic) : undefined;
    }

    getNextPicUrl(profile: Profile): string {
        const current = profile.pic ? profile.pic.split(':') : [];
        const idx = current.length < 2 ? 1 : Number(current[1]);
        return `/profiles/${profile.id}:${idx}`; // idx helps deal with CDN
    }
}

const profileService = new ProfileService();

export { profileService, ProfileService };
export type { Profile };

