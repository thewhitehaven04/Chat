import type { IAIChatAdapter } from '../chat-adapter/types'

export class AiChatService {
    private adapter: IAIChatAdapter

    constructor(adapter: IAIChatAdapter) {
        this.adapter = adapter
    }

    sendMessage(message: string) {
        return this.adapter.sendMessage(message)
    }
}
