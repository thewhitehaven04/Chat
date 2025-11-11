import type { SupabaseClient } from '@supabase/supabase-js'
import type {
    ISignInInputDto,
    ISignUpInputDto,
    IUserDto
} from '~~/shared/modules/auth/models/types'
import type { IAuthService } from './types'
import type { TSignInResult } from './models/types'

class AuthService<ClientType extends SupabaseClient> implements IAuthService {
    client: ClientType

    constructor(client: ClientType) {
        this.client = client
    }

    signUp(credentials: ISignUpInputDto) {
        this.client.auth.signUp({
            email: credentials.email,
            password: credentials.password,
            options: {
                data: {
                    name: credentials.name
                }
            }
        })
    }

    async signIn(credentials: ISignInInputDto): Promise<TSignInResult> {
        const result = this.client.auth.signInWithPassword(credentials)

        if (!(await result).error) {
            return { success: true }
        }
        return { success: false, message: (await result).error?.message || '' }
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
