import type { IContentInstance } from './models/types'

export interface IAIChatAdapter {
    createChatSession: (history: IContentInstance[]) => void
    sendMessage: (text: string) => ReadableStream<string> 
}
