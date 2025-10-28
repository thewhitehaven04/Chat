import { GoogleGenAI, type Chat, type Content, type Part } from '@google/genai'
import type { IAIChatAdapter } from './types'

export class GeminiChatAdapter implements IAIChatAdapter {
    private client: GoogleGenAI
    private chat: Chat

    constructor(history: Content[] = []) {
        const apiKey = useRuntimeConfig().aiApiKey
        this.client = new GoogleGenAI({ apiKey })
        this.chat = this.client.chats.create({ model: 'gemini-2.5-flash', history })
    }

    sendMessage(text: string) {
        const stream = this.chat.sendMessageStream({
            message: text
        })
        return new ReadableStream<string>({
            async pull(controller) {
                const next = await (await stream).next()
                if (next.done) {
                    controller.close()
                    return
                } else if (next.value) {
                    controller.enqueue(next.value.text)
                }
            }
        })
    }

    #getPartsTextContent(parts: Part[]) {
        return parts.map((part) => part.text).join('')
    }

    async getMessages() {
        const content = this.chat.getHistory(true)
        const messages = content
            .map((c) => (c.parts ? this.#getPartsTextContent(c.parts) : null))
            .filter(Boolean)
        return messages
    }
}
