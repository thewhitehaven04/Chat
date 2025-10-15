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
    submitted_by: string 
    chat_room: number
}

export interface IChatHistoryResponse {
    messages: IChatMessage[]
    hasMore: boolean
}