import type { AuthService } from './modules/auth/service'
import type { ChatService } from './modules/chat/service'

export declare module 'h3' {
  interface H3EventContext {
    auth: AuthService 
    chat: ChatService
  }
}