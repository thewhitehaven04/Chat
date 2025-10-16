export interface ISignUpInputDto {
    email: string
    password: string
    confirmPassword: string
    name: string
}

export interface ISignInInputDto {
    email: string
    password: string
}

export interface IUserDto {
    id: string | null
    email: string | null
}