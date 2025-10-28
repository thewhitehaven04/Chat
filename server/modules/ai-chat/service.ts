import type { IAIChatAdapter } from '../chat-adapter/types'

export class AiChatService {
    private adapter: IAIChatAdapter

    constructor(adapter: IAIChatAdapter) {
        this.adapter = adapter
    }

    async *sendMessage(message: string) {
        const stream = this.adapter.sendMessage(message)

        for await (const message of stream) {
            if (message !== undefined) {
                yield message
            } else {
                yield ''
            }
        }
    }
}
