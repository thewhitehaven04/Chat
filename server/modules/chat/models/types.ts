import type { IProfileReadDto } from '~~/server/modules/profile/models/types'
import type { IChatDto } from '../../chat-rooms/models/types'

export interface IMessageInputDto {
    chatRoom: number
    text: string
    respondingTo: string | null
}

export interface IMessageEditInputDto {
    id: string
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
    respondsTo: {
        id: string
        text: string
    } | null
}

export interface IChatMessageGroup {
    id: string
    messages: IMessage[]
    submitted_by: IProfileReadDto
    chat_room: number
}

export interface IIncomingMessagePayload {
    chat_room: number
    id: string
    modified_at: string | null
    submitted_at: string
    submitted_by: IProfileReadDto
    text: string
    responds_to: {
        id: string
        text: string
    } | null
}

export interface IChatHistoryResponse {
    chat: IChatDto
    messageGroups: IChatMessageGroup[]
    hasMore: boolean
}

export type TWebSocketSubscriptionPayload =
    | {
          action: 'update'
          data: IIncomingMessagePayload
      }
    | {
          action: 'delete'
          data: string
      }
    | {
          action: 'insert'
          data: IIncomingMessagePayload
      }

export type TWebSocketIncomingMessagePayload =
    | { action: 'edit'; id: string; chatRoom: number; text: string }
    | { action: 'submit'; chatRoom: number; text: string; respondingTo: string | null }
    | { action: 'delete'; id: string }
export interface IRawProfileData {
    id: string
    name: string
    avatar_url: string | null
}

export interface IRawChatMessagePayload {
    chat_room: number
    id: string
    modified_at: string | null
    submitted_at: string
    submitted_by: string
    text: string
    profiles: IRawProfileData
    responds_to: {
        chat_room: number
        id: string
        modified_at: string | null
        responds_to: string | null
        submitted_at: string
        submitted_by: string
        text: string
    } | null
}
