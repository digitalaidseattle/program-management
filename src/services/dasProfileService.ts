/**
 *  dasProfileService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { SupabaseEntityService } from "@digitalaidseattle/supabase";
import { Profile, ProfileDao } from './dasProfileDao';
import { getCoreServices } from "@digitalaidseattle/core";


class ProfileService extends SupabaseEntityService<Profile> {
    static _instance: ProfileService;

    static getInstance(): ProfileService {
        if (!this._instance) {
            this._instance = new ProfileService();
        }
        return this._instance;
    }

    public constructor() {
        super(ProfileDao.getInstance());
    }

    getDao(): ProfileDao {
        return this.dao as ProfileDao;
    }

    empty(): Profile {
        return this.getDao().empty();
    }

    async findByEmail(email: string): Promise<Profile> {
        return this.getDao().findByEmail(email);
    }

    async findByName(name: string): Promise<Profile> {
        return this.findByName(name);
    }

    getPicUrl(profile: Profile): string | undefined {
        const storageService = getCoreServices().storageService!;

        // FIXME: migrate url to pic attribute
        return profile.pic ? profile.pic : storageService.getUrl(`/profiles/${profile.id}`);
        // return profile.pic ? storageService.getUrl(profile.pic) : undefined;
    }

    getNextPicUrl(profile: Profile): string {
        const current = profile.pic ? profile.pic.split(':') : [];
        const idx = current.length < 2 ? 1 : Number(current[1]);
        return `/profiles/${profile.id}:${idx}`; // idx helps deal with CDN
    }
}


export { ProfileService };
export type { Profile };

