import type { IContentInstance } from './models/types'

export interface IAIChatAdapter {
    createChatSession: (history: IContentInstance[]) => void
    sendMessageStreaming: (text: string) => ReadableStream<string>
    sendMessage: (text: string) => Promise<string>
}
