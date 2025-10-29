export interface IChatRoomCreateDto {
    name: string
    description?: string
    type: 'default' | 'AI'
}

export interface IChatRoomReadDto {
    id: number
    name: string
    type: 'default' | 'AI'
    description: string | null
}
