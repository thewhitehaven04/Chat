export interface IAIChatRoomCreateDto {
    name: string
}

export interface IAIChatRoomDto extends IAIChatRoomCreateDto {
    id: number
    createdBy: string
}
