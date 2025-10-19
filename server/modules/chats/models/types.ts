export interface IChatCreateDto {
    name: string
    description: string | null
}

export interface IChatDto extends IChatCreateDto {
    id: number
}
