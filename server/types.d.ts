import type { IChatService } from './modules/chat/types'
import type { IChatRoomsService } from './modules/chat-rooms/types'
import type { IProfileService } from './modules/profile/types'
import type { IAiChatService } from './modules/ai-chat/types'
import type { IAiChatRoomsService } from './modules/ai-chat-rooms/types'

export declare module 'h3' {
    interface H3EventContext {
        auth: AuthService
        chat: IChatService
        chatRooms: IChatRoomsService
        profile: IProfileService
        aiChatRooms: IAiChatRoomsService 
        aiChat: IAiChatService
    }
}
