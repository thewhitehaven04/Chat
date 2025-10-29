export interface IChatCreateDto {
    name: string
    type: 'AI' | 'default'
    description: string | null
}

export interface IChatDto extends IChatCreateDto {
    id: number
}
