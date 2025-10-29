import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~~/server/supabase'
import type { IAIChatRoomsRepository } from './types'
import type { IAIChatRoomCreateDto } from './models/types'

export class AIChatRoomsRepository implements IAIChatRoomsRepository {
    #client: SupabaseClient<Database>

    constructor(client: SupabaseClient<Database>) {
        this.#client = client
    }

    async getAIChatRooms() {
        return (await this.#client.from('ai_chat_rooms').select('*').throwOnError()).data.map(
            (item) => ({
                id: item.id,
                name: item.name,
                createdBy: item.created_by
            })
        )
    }

    async createChatRoom(data: IAIChatRoomCreateDto) {
        await this.#client
            .from('ai_chat_rooms')
            .insert({
                name: data.name
            })
            .throwOnError()
    }
}
