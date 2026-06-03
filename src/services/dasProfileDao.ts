/**
 *  dasProfileService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { v4 as uuid } from 'uuid';

import { SupabaseConfiguration, SupabaseDAO } from "@digitalaidseattle/supabase";


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

class ProfileDao extends SupabaseDAO<Profile> {

    static _instance: ProfileDao;

    static getInstance(): ProfileDao {
        if (!this._instance) {
            this._instance = new ProfileDao();
        }
        return this._instance;
    }

    public constructor() {
        super(SupabaseConfiguration.getInstance().getSupabaseClient(), "profile");
    }

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

    async findByEmail(email: string): Promise<Profile> {
        return await this.client
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .ilike('email', email.toLowerCase())
            .single()
            .then((resp: any) => resp.data);
    }

    async findByName(name: string): Promise<Profile> {
        return await this.client
            .from(this.tableName)
            .select(DEFAULT_SELECT)
            .eq('name', name)
            .single()
            .then((resp: any) => resp.data);
    }
}


export { ProfileDao };
export type { Profile };

