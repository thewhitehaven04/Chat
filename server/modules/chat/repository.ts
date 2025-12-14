import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~~/server/supabase'
import type { IMessageEditInputDto, IMessageInputDto, IRawChatMessagePayload } from './models/types'
import type { IChatMessageRepository } from './types'

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
                chat_room: message.chatRoom,
                responds_to: message.respondingTo
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
            .select('*, profiles(*), responds_to(*)', {
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

    async updateMessage(message: IMessageEditInputDto): Promise<IRawChatMessagePayload> {
        return (
            await this.#client
                .from('chat_messages')
                .update({
                    text: message.text,
                    modified_at: new Date().toISOString()
                })
                .eq('id', message.id)
                .select('*, profiles(*), responds_to(*)')
                .single()
                .throwOnError()
        ).data
    }

    async getMessage(messageId: string): Promise<IRawChatMessagePayload> {
        return (
            await this.#client
                .from('chat_messages')
                .select('*, profiles(*), responds_to(*)')
                .eq('id', messageId)
                .single()
                .throwOnError()
        ).data
    }
}
