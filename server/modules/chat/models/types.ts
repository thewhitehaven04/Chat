import type { IProfileReadDto } from '~~/server/modules/profile/models/types'
import type { IChatDto } from '../../chat-rooms/models/types'

export interface IMessageInputDto {
    chatRoom: number
    text: string
}

export interface IMessageEditInputDto extends IMessageInputDto {
    id: string
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
    chat_room: number
    id: string
    modified_at: string | null
    submitted_at: string
    submitted_by: IProfileReadDto
    text: string
}

export interface IChatHistoryResponse {
    chat: IChatDto
    messageGroups: IChatMessageGroup[]
    hasMore: boolean
}

export type TSubscriptionPayload =
    | {
          action: 'update'
          old: Partial<IIncomingMessagePayload>
          new: IIncomingMessagePayload
      }
    | {
          action: 'delete'
          old: Partial<IIncomingMessagePayload>
          new: null
      }
    | {
          action: 'insert'
          old: null
          new: IIncomingMessagePayload
      }

export type TOutgoingWebSocketMessagePayload =
    | {
          action: 'insert'
          message: IIncomingMessagePayload
      }
    | {
          action: 'update'
          message: IIncomingMessagePayload
      }
    | {
          action: 'delete'
          messageId: string
      }

export type TWebSocketMessagePayload =
    | { action: 'edit'; messageId: string; chatRoom: number; text: string }
    | { action: 'submit'; chatRoom: number; text: string }
    | { action: 'delete'; messageId: string }
