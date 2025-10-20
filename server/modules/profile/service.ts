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

    async getCurrentProfile() {
        const userId = (await this.authService.getUser()).id

        if (!userId) {
            throw new Error('User is not logged in')
        }
        return this.getProfileData(userId)
    }

    async getProfileData(profileId: string): Promise<IProfile> {
        const profiles = await this.supabaseClient
            .from('profiles')
            .select('id, name, avatar_url')
            .filter('id', 'eq', profileId)
            .single()
            .throwOnError()

        return {
            id: profiles.data.id,
            name: profiles.data.name,
            avatarUrl: profiles.data.avatar_url
        }
    }
}
