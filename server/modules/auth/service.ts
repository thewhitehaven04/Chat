import type { SupabaseClient } from '@supabase/supabase-js'
import type { ISignInInputDto, ISignUpInputDto } from './types'

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
}

export { AuthService }
