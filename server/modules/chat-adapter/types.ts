export interface IAIChatAdapter {
    sendMessage: (text: string) => AsyncGenerator<string | undefined>
}
