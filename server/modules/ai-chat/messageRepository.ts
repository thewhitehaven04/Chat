import type { SupabaseClient } from '@supabase/supabase-js'
import type { IAIChatMessageRepository } from './types'
import type { Database } from '~~/server/supabase'
import type { IAIChatMessageDto, IAIChatMessageInputDto } from './models/types'

export class AIChatMessageRepository implements IAIChatMessageRepository {
    #client: SupabaseClient<Database>

    constructor(client: SupabaseClient<Database>) {
        this.#client = client
    }

    async storeUserMessage(message: IAIChatMessageInputDto) {
        await this.#client
            .from('ai_chat_messages')
            .insert({
                chat_id: message.chatRoomId,
                text: message.message,
                submitter: 'user',
            })
            .throwOnError()
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
            data: data
                .sort(
                    (m1, m2) =>
                        new Date(m1.submitted_at).getTime() - new Date(m2.submitted_at).getTime()
                )
                .map((m) => ({
                    id: m.id,
                    message: m.text,
                    chatRoomId: m.chat_id,
                    submitter: m.submitter,
                    date: m.submitted_at
                })),
            count
        }
    }

    async storeModelMessage(message: IAIChatMessageInputDto) {
        await this.#client
            .from('ai_chat_messages')
            .insert({
                chat_id: message.chatRoomId,
                text: message.message,
                submitter: 'model',
            })
            .throwOnError()
    }

    async getChatMessage(chatRoomId: number, messageId: string): Promise<IAIChatMessageDto> {
        const { data } = await this.#client
            .from('ai_chat_messages')
            .select('*')
            .eq('id', messageId)
            .eq('chat_id', chatRoomId)
            .single()
            .throwOnError()

        return {
            id: data.id,
            message: data.text,
            chatRoomId: data.chat_id,
            submitter: data.submitter,
            date: data.submitted_at
        }
    }
}
