import { RealtimeChannel } from '@supabase/realtime-js'

export default defineWebSocketHandler({
    open(peer) {
        peer.send("You've connected to the chat!")
    }
})
