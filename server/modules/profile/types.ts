import type { IProfileReadDto } from '~~/server/modules/profile/models/types'
import type { TProfileUpdateDto } from '~~/shared/modules/profile/models/validation'

export interface IProfileService {
    getCurrentProfile(): Promise<IProfileReadDto>
    updateProfile(profile: Partial<TProfileUpdateDto>): Promise<unknown>
    getProfileData(profileId: string): Promise<IProfileReadDto>
}
