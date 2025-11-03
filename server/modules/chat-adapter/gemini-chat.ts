import { GoogleGenAI, type Chat, type Part } from '@google/genai'
import type { IAIChatAdapter } from './types'
import { DomainError } from '~~/server/shared/DomainError'
import type { IContentInstance } from './models/types'

export class GeminiChatAdapter implements IAIChatAdapter {
    #client: GoogleGenAI
    #chat: Chat | null
    static SERVICE_MODEL = 'gemini-2.5-flash'

    constructor() {
        const apiKey = useRuntimeConfig().aiApiKey
        this.#client = new GoogleGenAI({ apiKey })
        this.#chat = null
    }

    createChatSession(history: IContentInstance[] = []) {
        this.#chat = this.#client.chats.create({ model: 'gemini-2.5-flash', history })
    }

    sendMessageStreaming(text: string) {
        if (this.#chat === null) throw new DomainError('Chat session is not initialized')

        const stream = this.#chat.sendMessageStream({
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
        if (this.#chat === null) throw new DomainError('Chat session is not initialized')

        const content = this.#chat.getHistory(true)
        const messages = content
            .map((c) => (c.parts ? this.#getPartsTextContent(c.parts) : null))
            .filter(Boolean)
        return messages
    }

    async sendMessage(text: string): Promise<string> {
        const result = await this.#client.models.generateContent({
            contents: [{ role: 'user', parts: [{ text }] }],
            model: GeminiChatAdapter.SERVICE_MODEL
        })
        if (!result.text) {
            throw new DomainError('AI adapter did not return a text response.')
        }
        return result.text 
    }
}
