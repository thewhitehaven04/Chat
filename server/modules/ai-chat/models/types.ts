export interface IAIChatMessageInputDto {
    message: string
    chatRoomId: number 
}

export interface IAIChatMessageDto extends IAIChatMessageInputDto {
    id: number
    submitter: 'model' | 'user'
}