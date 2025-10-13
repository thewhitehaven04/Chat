import type { AuthService } from './modules/auth/service'

export declare module 'h3' {
  interface H3EventContext {
    auth: AuthService 
  }
}