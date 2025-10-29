import type { IChatService } from './modules/chat/types'
import type { IChatRoomsService } from './modules/chat-rooms/types'
import type { IProfileService } from './modules/profile/types'
import type { IAiChatService } from './modules/ai-chat/types'

export declare module 'h3' {
    interface H3EventContext {
        auth: AuthService
        chat: IChatService
        chatRooms: IChatRoomsService
        profile: IProfileService
        aiChatRooms: IAIChatRoomsService
        aiChat: IAiChatService
    }
}
