export interface IChatRoomCreateDto {
    name: string
    description?: string
}

export interface IChatRoomReadDto {
    id: number
    name: string
    description: string | null
}


export interface IChatCreateDto {
    name: string
    description: string | null
}

export interface IChatDto extends IChatCreateDto {
    id: number
}