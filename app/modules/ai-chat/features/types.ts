interface IModelMessageProps {
    type: 'model'
    message: string
    date: Date
}

export interface IMessageResponse {
    id: string
    text: string
}

export interface IUserMessageProps {
    id: string
    type: 'user'
    message: string
    date: Date
    respondingTo: IMessageResponse
}

interface IAIUserMessageProps {
    id: string
    type: 'userToModel'
    message: string
    date: Date
}

export type TAIChatMessageProps = IAIUserMessageProps | IModelMessageProps
