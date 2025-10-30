interface IPart {
    text: string
}

type TRole = 'user' | 'model'

export interface IContentInstance {
    parts: IPart[]
    role: TRole
}