export interface IAIChatMessageInputDto {
    message: string
    chatRoomId: number 
}

export interface IAIChatMessageDto extends IAIChatMessageInputDto {
    id: string 
    submitter: 'model' | 'user'
    date: string
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