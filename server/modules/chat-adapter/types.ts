export interface IAIChatAdapter {
    sendMessage: (text: string) => ReadableStream<string> 
}
