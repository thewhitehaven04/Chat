import type { SupabaseClient } from '@supabase/supabase-js'
import type { IChatCreateDto } from '~~/server/modules/chats/models/types'
import type { Database } from '~~/server/supabase'
import type { IChatRoomsService } from './types'

class ChatRoomsService<ClientType extends SupabaseClient<Database>> implements IChatRoomsService<ClientType> {
    client: ClientType

    constructor(client: ClientType) {
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
