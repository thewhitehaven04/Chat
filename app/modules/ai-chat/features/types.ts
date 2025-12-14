interface IModelMessageProps {
    type: 'model'
    message: string
    date: Date
}

interface IMessageReponse {
    id: string
    text: string
}

export interface IUserMessageProps {
    id: string
    type: 'user'
    message: string
    date: Date
    respondingTo: IMessageReponse
}

interface IAIUserMessageProps {
    id: string
    type: 'userToModel'
    message: string
    date: Date
}

export type TAIChatMessageProps = IAIUserMessageProps | IModelMessageProps
