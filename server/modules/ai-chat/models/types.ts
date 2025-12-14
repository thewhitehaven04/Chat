export interface IAIChatMessageInputDto {
    message: string
    chatRoomId: number
}


export interface IAIChatMessageDto extends IAIChatMessageInputDto {
    id: string
    submitter: 'model' | 'userToModel'
    date: string
}

export interface IAICreateChatResponseDto {
    chatId: number
    name: string
    createdBy: string
    summary: string
}

export interface IAIChatMessageHistoryDto {
    messages: IAIChatMessageDto[]
    hasMore: boolean
}

export interface IAIChatRoomCreateDto {
    name: string
}

export interface IAIChatRoomDto extends IAIChatRoomCreateDto {
    id: number
    createdBy: string
}
