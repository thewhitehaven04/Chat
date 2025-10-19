import type { SupabaseClient } from '@supabase/supabase-js'
import type { IChatCreateDto } from '~~/server/modules/chats/models/types'
import type { Database } from '~~/server/supabase'

class ChatRoomsService {
    client: SupabaseClient<Database>

    constructor(client: SupabaseClient<Database>) {
        this.client = client
    }

    async getChatRooms() {
        return (await this.client.from('chat_rooms').select('*').throwOnError()).data
    }

    async createChatRoom(chatRoom: IChatCreateDto) {
        return (await this.client.from('chat_rooms').insert(chatRoom).throwOnError()).data
    }
}

export { ChatRoomsService }
