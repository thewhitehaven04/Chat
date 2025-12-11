import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~~/server/supabase'
import type { IMessageEditInputDto, IMessageInputDto } from './models/types'
import type { IChatMessageRepository } from './types'
import type { IRawChatMessagePayload } from './models/types'

export class ChatMessageRepository implements IChatMessageRepository {
    #client: SupabaseClient<Database>

    constructor(client: SupabaseClient<Database>) {
        this.#client = client
    }

    async storeMessage(message: IMessageInputDto) {
        return await this.#client
            .from('chat_messages')
            .insert({
                text: message.text,
                chat_room: message.chatRoom
            })
            .throwOnError()
    }

    async getChatMessages(
        chatRoomId: string,
        skip: number,
        limit: number
    ): Promise<{ data: IRawChatMessagePayload[]; count: number | null }> {
        const { data, count } = await this.#client
            .from('chat_messages')
            .select('*, profiles(*)', {
                count: 'exact'
            })
            .order('submitted_at', {
                ascending: false
            })
            .filter('chat_room', 'eq', chatRoomId)
            .range(skip, skip + limit)
            .throwOnError()

        return { data, count }
    }

    async deleteMessage(messageId: string) {
        await this.#client.from('chat_messages').delete().eq('id', messageId).throwOnError()
    }

    async updateMessage(message: IMessageEditInputDto) {
        return (
            await this.#client
                .from('chat_messages')
                .update({
                    text: message.text,
                    modified_at: new Date().toISOString()
                })
                .eq('id', message.id)
                .select('*, profiles(*)')
                .single()
                .throwOnError()
        ).data
    }
}
