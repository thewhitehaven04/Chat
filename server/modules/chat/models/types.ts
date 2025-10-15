export interface IMessageInputDto {
    chat_room: number
    text: string
}

export interface IGetChatHistoryRequestDto {
    chat_room: number
    limit: number
    skip: number
}
