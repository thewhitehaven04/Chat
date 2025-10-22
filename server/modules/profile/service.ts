import type { SupabaseClient } from '@supabase/supabase-js'
import type { AuthService } from '~~/server/modules/auth/service'
import type { IProfileReadDto } from '~~/server/modules/profile/models/types'
import type { Database } from '~~/server/supabase'
import type { TProfileUpdateDto } from '~~/shared/modules/profile/models/validation'

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

    async updateProfile(profile: Partial<TProfileUpdateDto>) {
        const userId = (await this.authService.getUser()).id
        if (!userId) {
            throw new Error('User is not logged in')
        }
        let avatarUrl: string | null = null
        if (profile.avatar) {
            const { data, error } = await this.supabaseClient.storage
                .from('')
                .upload(`${userId}.${profile.avatar.name.split('.').pop()}`, profile.avatar)

            if (!error) {
                avatarUrl = data.fullPath
            }
            throw new Error('Unable to upload the profile picture')
        }

        return (
            await this.supabaseClient
                .from('profiles')
                .update({ ...profile, avatar_url: avatarUrl })
                .eq('id', userId)
                .select('*')
                .single()
                .throwOnError()
        ).data
    }

    async getProfileData(profileId: string): Promise<IProfileReadDto> {
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
