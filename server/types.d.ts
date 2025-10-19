import type { ChatRoomsService } from '~~/server/modules/chats/service'
import type { AuthService } from './modules/auth/service'
import type { ChatService } from './modules/chat/service'
import type { ProfileService } from '~~/server/modules/profile/service'

export declare module 'h3' {
  interface H3EventContext {
    auth: AuthService 
    chat: ChatService
    chatRooms: ChatRoomsService
    profile: ProfileService
  }
}