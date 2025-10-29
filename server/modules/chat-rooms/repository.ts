import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~~/server/supabase'
import type { IChatRoomCreateDto } from './models/types'
import type { IChatRoomRepository } from './types'

export class ChatRoomRepository implements IChatRoomRepository {
    #client: SupabaseClient<Database>

    constructor(client: SupabaseClient<Database>) {
        this.#client = client
    }

    async createChatRoom(data: IChatRoomCreateDto) {
        const response = await this.#client
            .from('chat_rooms')
            .insert(data)
            .throwOnError()
            .select('*')
            .single()

        if (response.error) {
            throw new Error('Unable to create the chat room')
        }

        return {
            id: response.data?.id,
            name: response.data?.name,
            description: response.data?.description,
            type: response.data?.type
        }
    }

    async getChatRooms() {
        return (await this.#client.from('chat_rooms').select('*').throwOnError()).data
    }

    async getChatRoom(chatRoomId: string) {
        return (
            await this.#client
                .from('chat_rooms')
                .select('*')
                .filter('id', 'eq', chatRoomId)
                .single()
                .throwOnError()
        ).data
    }
}
