import type { IChatDto } from '~~/server/modules/chats/models/types'
import type { IProfileReadDto } from '~~/server/modules/profile/models/types'

export interface IMessageInputDto {
    chatRoom: number
    text: string
}

export interface IGetChatHistoryRequestDto {
    chatRoom: number
    limit: number
    skip: number
}

export interface IMessage {
    id: string
    text: string
    submitted_at: string
}

export interface IChatMessageGroup {
    id: string
    messages: IMessage[]
    submitted_by: IProfileReadDto
    chat_room: number
}

export interface IIncomingMessagePayload {
    chat_room: number;
    id: string;
    modified_at: string | null;
    submitted_at: string;
    submitted_by: IProfileReadDto;
    text: string;
}

export interface IChatHistoryResponse {
    chat: IChatDto
    messageGroups: IChatMessageGroup[]
    hasMore: boolean
}
