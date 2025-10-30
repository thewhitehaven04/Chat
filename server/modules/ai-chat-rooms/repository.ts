import type { SupabaseClient } from '@supabase/supabase-js'
import type { IAiChatRoomsRepository } from './types'
import type { Database } from '~~/server/supabase'
import { DatabaseError } from '~~/server/shared/DatabaseError'

export class AIChatRoomsRepository implements IAiChatRoomsRepository {
    #client: SupabaseClient<Database>

    constructor(client: SupabaseClient<Database>) {
        this.#client = client
    }

    async getAIChatRooms() {
        const { data, error } = await this.#client.from('ai_chat_rooms').select('*').throwOnError()

        if (!error) {
            return data.map((item) => ({
                id: item.id,
                name: item.name,
                createdBy: item.created_by
            }))
        }

        throw new DatabaseError('Unable to get the rooms')
    }
}
