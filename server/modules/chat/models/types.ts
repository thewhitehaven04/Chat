import type { IChatDto } from '~~/server/modules/chats/models/types'
import type { IProfile } from '~~/server/modules/profile/models/types'

export interface IMessageInputDto {
    chatRoom: number
    text: string
}

export interface IGetChatHistoryRequestDto {
    chatRoom: number
    limit: number
    skip: number
}

export interface IChatMessage {
    id: string 
    text: string
    submitted_at: string
    submitted_by: IProfile 
    chat_room: number
}

export interface IChatHistoryResponse {
    chat: IChatDto 
    messages: IChatMessage[]
    hasMore: boolean
}