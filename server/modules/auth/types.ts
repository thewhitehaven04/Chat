import type {
    ISignInInputDto,
    ISignUpInputDto,
    IUserDto
} from '~~/shared/modules/auth/models/types'
import type { TSignInResult } from './models/types'

export interface IAuthService {
    signUp(credentials: ISignUpInputDto): void
    signIn(credentials: ISignInInputDto): Promise<TSignInResult>
    signOut(): Promise<void>
    getUser(jwt?: string): Promise<IUserDto>
}
