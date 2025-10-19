import type { SupabaseClient } from '@supabase/supabase-js'
import type { AuthService } from '~~/server/modules/auth/service'
import type { IProfile } from '~~/server/modules/profile/models/types'
import type { Database } from '~~/server/supabase'

export class ProfileService {
    supabaseClient: SupabaseClient<Database>
    authService: AuthService

    constructor(client: SupabaseClient<Database>, authService: AuthService) {
        this.supabaseClient = client
        this.authService = authService
    }

    #getAvatarUrl(profileId: string) {
        return this.supabaseClient.storage.from('profileImages').getPublicUrl(profileId).data
            .publicUrl
    }

    async getCurrentProfile() {
        const userId = (await this.authService.getUser()).id

        if (!userId) {
            throw new Error('User is not logged in')
        }
        return this.getProfileData(userId)
    }

    async getProfileData(profileId: string): Promise<IProfile> {
        const { data } = await this.supabaseClient
            .from('profiles')
            .select('*')
            .filter('id', 'eq', profileId)
            .single()
            .throwOnError()

        const avatarUrl = this.#getAvatarUrl(profileId)

        return {
            id: data.id,
            name: data.name,
            avatarUrl: avatarUrl || null
        }
    }
}
