import type { SupabaseClient } from '@supabase/supabase-js'
import type { ISignInInputDto, ISignUpInputDto, IUserDto } from '../../../shared/modules/auth/models/types'

class AuthService {
    client: SupabaseClient

    constructor(client: SupabaseClient) {
        this.client = client
    }

    signUp(credentials: ISignUpInputDto) {
        this.client.auth.signUp(credentials)
    }

    async signIn(credentials: ISignInInputDto) {
        return this.client.auth.signInWithPassword(credentials)
    }

    async signOut() {
        await this.client.auth.signOut()
    }

    async getUser(jwt?: string): Promise<IUserDto> {
        const user = await this.client.auth.getUser(jwt)

        if (user.data.user?.email) {
            return {
                email: user.data.user.email,
                id: user.data.user.id
            }
        }
        return {
            email: null,
            id: null
        }
    }
}

export { AuthService }
