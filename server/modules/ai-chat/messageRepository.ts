import type { SupabaseClient } from '@supabase/supabase-js'
import type { IAIChatMessageRepository } from './types'
import type { Database } from '~~/server/supabase'
import type { IAIChatMessageInputDto } from './models/types'

export class AIChatMessageRepository implements IAIChatMessageRepository {
    #client: SupabaseClient<Database>

    constructor(client: SupabaseClient<Database>) {
        this.#client = client
    }

    async storeUserMessage(message: IAIChatMessageInputDto) {
        await this.#client.from('ai_chat_messages').insert({
            chat_id: message.chatRoomId,
            text: message.message,
            submitter: 'user'
        })
    }

    async getChatHistory(chatRoomId: number, skip: number, limit: number) {
        const { data, count } = await this.#client
            .from('ai_chat_messages')
            .select('*', {
                count: 'exact'
            })
            .order('submitted_at', {
                ascending: false
            })
            .filter('chat_id', 'eq', chatRoomId)
            .range(skip, skip + limit)
            .throwOnError()

        return {
            data: data.map((m) => ({
                id: m.id,
                message: m.text,
                chatRoomId: m.chat_id,
                submitter: m.submitter
            })),
            count
        }
    }

    async storeModelMessage(message: IAIChatMessageInputDto) {
        await this.#client.from('ai_chat_messages').insert({
            chat_id: message.chatRoomId,
            text: message.message,
            submitter: 'model'
        })
    }
}
