import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'

class ChatService {
    channel: RealtimeChannel
    constructor(client: SupabaseClient) {
        this.channel = client.channel('table-db-changes')
    }

    subscribe(
        messageCallbackFn: (
            oldMessage: Record<string, unknown>,
            newMessage: Record<string, unknown>
        ) => void
    ) {
        this.channel.on(
            'postgres_changes',
            { event: '*', schema: 'public', table: '' },
            (payload) => {
                messageCallbackFn(payload.old, payload.new)
            }
        )
    }

    async unsubscribe() {
        await this.channel.unsubscribe()
    }
}

export { ChatService }
