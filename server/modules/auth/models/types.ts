export interface ISuccessfulResult {
    success: true
}

export interface IErrorResult {
    success: false
    message: string
}

export type TSignInResult = ISuccessfulResult | IErrorResult 