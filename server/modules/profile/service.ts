import type { SupabaseClient } from '@supabase/supabase-js'
import type { AuthService } from '~~/server/modules/auth/service'
import type { IProfileReadDto } from '~~/server/modules/profile/models/types'
import type { Database } from '~~/server/supabase'
import type { TProfileUpdateDto } from '~~/shared/modules/profile/models/validation'
import type { IProfileService } from './types'

export class ProfileService<
    ClientType extends SupabaseClient<Database>,
    AuthServiceType extends AuthService<ClientType>
> implements IProfileService<ClientType, AuthServiceType> {
    client: ClientType
    authService: AuthServiceType

    constructor(client: ClientType, authService: AuthServiceType) {
        this.client = client
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
            const { data, error } = await this.client.storage
                .from('avatars')
                .upload(`public/${userId}`, profile.avatar, {
                    upsert: true,
                    cacheControl: '0'
                })

            if (!error) {
                avatarUrl = this.client.storage.from('avatars').getPublicUrl(data.path)
                    .data.publicUrl
            }
        }

        return (
            await this.client
                .from('profiles')
                .update({ name: profile.name, avatar_url: avatarUrl ?? undefined })
                .eq('id', userId)
                .throwOnError()
        ).data
    }

    async getProfileData(profileId: string): Promise<IProfileReadDto> {
        const profiles = await this.client
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
