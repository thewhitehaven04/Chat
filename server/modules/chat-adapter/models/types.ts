interface IPart {
    text: string
}

type TRole = 'userToModel' | 'model'

export interface IContentInstance {
    parts: IPart[]
    role: TRole
}