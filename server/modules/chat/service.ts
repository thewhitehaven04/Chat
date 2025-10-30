import type {
    RealtimeChannel,
    RealtimePostgresInsertPayload,
    SupabaseClient
} from '@supabase/supabase-js'
import type { AuthService } from '../auth/service'
import type { Database } from '~~/server/supabase'
import type {
    IChatHistoryResponse,
    IChatMessageGroup,
    IGetChatHistoryRequestDto,
    IIncomingMessagePayload,
    IMessageInputDto
} from '~~/server/modules/chat/models/types'
import type { IChatMessageRepository, IChatService } from './types'
import type { ProfileService } from '../profile/service'
import type { IChatRoomRepository } from '../chat-rooms/types'

class ChatService implements IChatService {
    #client: SupabaseClient<Database>
    #profileSerivce: ProfileService
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
        this.#profileSerivce = profileService
        this.#chatMessageRepository = chatMessageRepository
        this.#chatRoomRepository = chatRoomRepository
        this.#subscriptionChannel = null
    }

    subscribe(
        messageCallbackFn: (oldMessage: unknown, newMessage: IIncomingMessagePayload) => void
    ) {
        this.#subscriptionChannel = this.#client
            .channel('chat_messages_realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'chat_messages' },
                async (
                    payload: RealtimePostgresInsertPayload<
                        Database['public']['Tables']['chat_messages']['Row']
                    >
                ) => {
                    const profile = await this.#profileSerivce.getProfileData(
                        payload.new.submitted_by
                    )
                    messageCallbackFn(
                        {
                            ...payload.old,
                            submitted_by: profile
                        },
                        { ...payload.new, submitted_by: profile }
                    )
                }
            )
            .subscribe()
    }

    async sendMessage(message: IMessageInputDto) {
        return await this.#chatMessageRepository.storeMessage(message)
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
                            submitted_at: message.submitted_at
                        })
                    } else {
                        lastGroup = {
                            chat_room: message.chat_room,
                            id: message.id,
                            messages: [
                                {
                                    id: message.id,
                                    text: message.text,
                                    submitted_at: message.submitted_at
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
                                submitted_at: message.submitted_at
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
