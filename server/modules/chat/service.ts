import type {
    RealtimeChannel,
    RealtimePostgresChangesPayload,
    RealtimePostgresDeletePayload,
    RealtimePostgresInsertPayload,
    RealtimePostgresUpdatePayload,
    SupabaseClient
} from '@supabase/supabase-js'
import type { Database } from '~~/server/supabase'
import type {
    IChatHistoryResponse,
    IChatMessageGroup,
    IGetChatHistoryRequestDto,
    IIncomingMessagePayload,
    IMessageEditInputDto,
    IMessageInputDto,
    TWebSocketSubscriptionPayload
} from '~~/server/modules/chat/models/types'
import type { IChatMessageRepository, IChatService } from './types'
import type { ProfileService } from '../profile/service'
import type { IChatRoomRepository } from '../chat-rooms/types'

class ChatService implements IChatService {
    #client: SupabaseClient<Database>
    #profileService: ProfileService
    #chatMessageRepository: IChatMessageRepository
    #chatRoomRepository: IChatRoomRepository
    #subscriptionChannel: RealtimeChannel | null

    constructor(
        client: SupabaseClient<Database>,
        profileService: ProfileService,
        chatMessageRepository: IChatMessageRepository,
        chatRoomRepository: IChatRoomRepository
    ) {
        this.#client = client
        this.#profileService = profileService
        this.#chatMessageRepository = chatMessageRepository
        this.#chatRoomRepository = chatRoomRepository
        this.#subscriptionChannel = null
    }

    subscribe(messageCallbackFn: (subscriptionAction: TWebSocketSubscriptionPayload) => void) {
        this.#subscriptionChannel = this.#client
            .channel('chat_messages_realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'chat_messages' },
                async (
                    payload: RealtimePostgresChangesPayload<
                        Database['public']['Tables']['chat_messages']['Row']
                    >
                ) => {
                    switch (payload.eventType) {
                        case 'INSERT':
                            await this.handleMessageSubmit(payload, messageCallbackFn)
                            break
                        case 'DELETE':
                            this.handleMessageDelete(payload, messageCallbackFn)
                            break
                        case 'UPDATE':
                            await this.handleMessageUpdate(payload, messageCallbackFn)
                            break
                    }
                }
            )
            .subscribe()
    }

    private async handlePayload(
        payload:
            | RealtimePostgresInsertPayload<Database['public']['Tables']['chat_messages']['Row']>
            | RealtimePostgresUpdatePayload<Database['public']['Tables']['chat_messages']['Row']>,
        messageCallbackFn: (subscriptionAction: TWebSocketSubscriptionPayload) => void,
        action: 'insert' | 'update'
    ) {
        try {
            const profile = await this.#profileService.getProfileData(payload.new.submitted_by)
            const respondsTo = await this.fetchRespondsToMessage(payload.new.responds_to)
            console.log('Responds to on server:', respondsTo)
            messageCallbackFn({
                action,
                data: {
                    ...payload.new,
                    submitted_by: profile,
                    responds_to: respondsTo
                }
            })
        } catch (error) {
            console.error(`Error handling ${action} payload:`, error)
        }
    }

    private async handleMessageSubmit(
        payload: RealtimePostgresInsertPayload<{
            chat_room: number
            id: string
            modified_at: string | null
            responds_to: string | null
            submitted_at: string
            submitted_by: string
            text: string
        }>,
        messageCallbackFn: (subscriptionAction: TWebSocketSubscriptionPayload) => void
    ) {
        await this.handlePayload(payload, messageCallbackFn, 'insert')
    }

    private handleMessageDelete(
        payload: RealtimePostgresDeletePayload<
            Database['public']['Tables']['chat_messages']['Row']
        >,
        messageCallbackFn: (subscriptionAction: TWebSocketSubscriptionPayload) => void
    ) {
        messageCallbackFn({
            action: 'delete',
            data: payload.old.id || ''
        })
    }

    private async handleMessageUpdate(
        payload: RealtimePostgresUpdatePayload<{
            chat_room: number
            id: string
            modified_at: string | null
            responds_to: string | null
            submitted_at: string
            submitted_by: string
            text: string
        }>,
        messageCallbackFn: (subscriptionAction: TWebSocketSubscriptionPayload) => void
    ) {
        await this.handlePayload(payload, messageCallbackFn, 'update')
    }

    private async fetchRespondsToMessage(
        respondsToId: string | null
    ): Promise<{ id: string; text: string } | null> {
        if (!respondsToId) return null
        const messageBeingRespondedTo = await this.#chatMessageRepository.getMessage(respondsToId)
        return {
            id: messageBeingRespondedTo.id,
            text: messageBeingRespondedTo.text
        }
    }

    async sendMessage(message: IMessageInputDto) {
        return await this.#chatMessageRepository.storeMessage(message)
    }

    async editMessage(message: IMessageEditInputDto) {
        return await this.#chatMessageRepository.updateMessage(message)
    }

    async deleteMessage(messageId: string): Promise<void> {
        return await this.#chatMessageRepository.deleteMessage(messageId)
    }

    unsubscribe() {
        if (this.#subscriptionChannel) {
            this.#subscriptionChannel.unsubscribe()
        }
    }

    async getChatHistory(params: IGetChatHistoryRequestDto): Promise<IChatHistoryResponse> {
        const [rawMessagesResponse, chatRoomData] = await Promise.all([
            this.#chatMessageRepository.getChatMessages(
                params.chatRoom.toString(),
                params.skip,
                params.limit
            ),
            this.#chatRoomRepository.getChatRoom(params.chatRoom.toString())
        ])

        if (!chatRoomData) {
            throw new Error('Chat room not found')
        }

        let hasMore = false
        if (rawMessagesResponse.count) {
            hasMore = rawMessagesResponse.count > rawMessagesResponse.data.length
        }

        const messages: IIncomingMessagePayload[] = rawMessagesResponse.data.map((rawMessage) => ({
            chat_room: rawMessage.chat_room,
            id: rawMessage.id,
            modified_at: rawMessage.modified_at,
            submitted_at: rawMessage.submitted_at,
            submitted_by: {
                id: rawMessage.profiles.id,
                name: rawMessage.profiles.name,
                avatarUrl: rawMessage.profiles.avatar_url
            },
            responds_to: rawMessage.responds_to
                ? {
                      id: rawMessage.responds_to?.id,
                      text: rawMessage.responds_to?.text
                  }
                : null,
            text: rawMessage.text
        }))

        const groups: IChatMessageGroup[] = []

        if (messages) {
            messages.sort((a, b) => {
                return new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
            })
            let lastGroup: IChatMessageGroup | null = null
            for (const message of messages) {
                if (lastGroup !== null) {
                    if (message.submitted_by.id === lastGroup.submitted_by.id) {
                        lastGroup.messages.push({
                            id: message.id,
                            text: message.text,
                            submitted_at: message.submitted_at,
                            respondsTo: message.responds_to
                                ? {
                                      id: message.responds_to?.id,
                                      text: message.responds_to.text
                                  }
                                : null
                        })
                    } else {
                        lastGroup = {
                            chat_room: message.chat_room,
                            id: message.id,
                            messages: [
                                {
                                    id: message.id,
                                    text: message.text,
                                    submitted_at: message.submitted_at,
                                    respondsTo: message.responds_to
                                        ? {
                                              id: message.responds_to?.id,
                                              text: message.responds_to.text
                                          }
                                        : null
                                }
                            ],
                            submitted_by: message.submitted_by
                        }
                        groups.push(lastGroup)
                    }
                } else {
                    lastGroup = {
                        chat_room: message.chat_room,
                        id: message.id,
                        messages: [
                            {
                                id: message.id,
                                text: message.text,
                                submitted_at: message.submitted_at,
                                respondsTo: message.responds_to
                                    ? {
                                          id: message.responds_to?.id,
                                          text: message.responds_to.text
                                      }
                                    : null
                            }
                        ],
                        submitted_by: message.submitted_by
                    }
                    groups.push(lastGroup)
                }
            }
        }

        return {
            chat: {
                id: chatRoomData.id,
                name: chatRoomData.name,
                description: chatRoomData.description
            },
            messageGroups: groups,
            hasMore
        }
    }
}

export { ChatService }
