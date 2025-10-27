import type {
    ISignInInputDto,
    ISignUpInputDto,
    IUserDto
} from '~~/shared/modules/auth/models/types'

export interface IAuthService<TClient> {
    client: TClient

    signUp(credentials: ISignUpInputDto): void
    signIn(credentials: ISignInInputDto): Promise<unknown>
    signOut(): Promise<void>
    getUser(jwt?: string): Promise<IUserDto>
}
