import { supabaseClient } from "@digitalaidseattle/supabase"


export class SupabaseStorage {
    bucket = 'program-management'
    upload(path: string, blob: any) {
        return supabaseClient
            .storage
            .from(this.bucket)
            .upload(path, blob)
            .then((resp: any) => {
                if (resp.error) {
                    throw new Error(resp.error.message)
                }
                return resp.data
            })
    }

    list = async (filepath?: string): Promise<any[]> => {
        return supabaseClient
            .storage
            .from(this.bucket)
            .list(filepath)
            .then((resp: any) => {
                if (resp.error) {
                    throw new Error(resp.error.message)
                }
                return resp.data?.filter((f: any) => f.name != '.emptyFolderPlaceholder')
            })
    }



    getUrl(filepath: string): string {
        const resp = supabaseClient
            .storage
            .from(this.bucket)
            .getPublicUrl(filepath);
        return resp.data.publicUrl
    }

    downloadBlob = async (filepath: string): Promise<Blob | null> => {
        return supabaseClient
            .storage
            .from(this.bucket)
            .download(filepath)
            .then((resp: any) => {
                if (resp.error) {
                    throw new Error(resp.error.message)
                }
                return resp.data
            })
    }
}