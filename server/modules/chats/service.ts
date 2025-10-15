import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~~/server/supabase'

class ChatRoomsService {
    client: SupabaseClient<Database>

    constructor(client: SupabaseClient<Database>) {
        this.client = client
    }

    async getChatRooms() {
        return (await this.client.from('chat_rooms').select('*').throwOnError()).data
    }
}

export { ChatRoomsService }
