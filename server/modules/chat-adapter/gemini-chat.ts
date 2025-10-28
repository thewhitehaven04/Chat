import { GoogleGenAI, type Chat } from '@google/genai'
import type { IAIChatAdapter } from './types'

export class GeminiChatAdapter implements IAIChatAdapter {
    private client: GoogleGenAI
    private chat: Chat

    constructor() {
        const apiKey = useRuntimeConfig().aiApiKey
        this.client = new GoogleGenAI({ apiKey })
        this.chat = this.client.chats.create({ model: 'gemini-2.5-flash' })
    }

    async *sendMessage(text: string) {
        const stream = await this.chat.sendMessageStream({
            message: text
        })
        for await (const message of stream) {
            yield message.text
        }
    }
}
