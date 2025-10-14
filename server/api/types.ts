interface IChatPeerSuccesfulMessage {
    success: true
    data: string
    error: null
}

interface IChatPeerErrorMessage {
    success: false
    data: null
    error: string
}

export type TChatMessage = IChatPeerSuccesfulMessage | IChatPeerErrorMessage
