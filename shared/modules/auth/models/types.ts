export interface ISignUpInputDto {
    email: string
    password: string
    confirmPassword: string
}

export interface ISignInInputDto {
    email: string
    password: string
}

export interface IUserDto {
    id: string | null
    email: string | null
}