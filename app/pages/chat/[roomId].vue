<script setup lang="ts">
import { useChat } from '~/modules/chat/composables/useChat'
import type { IMessageSequenceProps } from '~/modules/chat/models/types'

const params = useRoute().params

const { pending, data: chatMessages } = useFetch(`/api/chat/${params.roomId}/history`)

const { sendMessage, messages, isDisconnected } = useChat({
    onNewMessage: () => {
        scrollTargetRef.value?.scroll()
    },
    chatRoomId: params.roomId as string
})

watch(chatMessages, (input) => {
    if (input) {
        const messageSequence: IMessageSequenceProps[] = []

        for (let i = 0; i < input.messages.length; i++) {
            const previousSender = i > 0 ? messageSequence.at(-1)?.submittedBy.id : null

            const message = input.messages[i]

            if (message) {
                if (message.submitted_by.id !== previousSender) {
                    messageSequence.push({
                        id: message.id,
                        avatarUrl: message.submitted_by.avatarUrl,
                        submittedBy: {
                            id: message.submitted_by.id,
                            name: message.submitted_by.name
                        },
                        messages: [
                            {
                                text: message.text,
                                submittedAt: message.submitted_at
                            }
                        ]
                    })
                } else {
                    messageSequence.at(-1)!.messages.push({
                        text: message?.text,
                        submittedAt: message.submitted_at
                    })
                }
            }

            messages.value = messageSequence
        }
    }
})

const isTextareaDisabled = ref(false)

const showLoadingState = computed(() => pending.value)
const showNoMessages = computed(() => messages.value.length === 0 && !pending.value)

const scrollTargetRef = useTemplateRef('scrollTarget')
</script>

<template>
    <UContainer class="flex flex-col gap-4 h-full">
        <UHeader>
            <template #left>
                <div class="flex flex-col gap-2 mb-4">
                    <h1 class="text-xl font-bold">{{ chatMessages?.chat.name }}</h1>
                    <p class="text-neutral-700">{{ chatMessages?.chat.description }}</p>
                </div>
            </template>
        </UHeader>
        <div ref="chat" class="flex-1 overflow-y-scroll">
            <USkeleton v-if="showLoadingState" class="h-12 w-12 rounded-full" />
            <ul v-else>
                <li class="flex flex-col items-start justify-center flex-1 gap-8 w-full">
                    <ChatFeaturesMessageSequence
                        v-for="m in messages"
                        :id="m.id"
                        :key="m.id"
                        :avatar-url="m.avatarUrl"
                        :submitted-by="m.submittedBy"
                        :messages="m.messages"
                    />
                </li>
            </ul>
            <span ref="scrollTarget" />
        </div>
        <div class="flex flex-col items-center justify-center">
            <div v-if="showNoMessages">It's too empty in here...</div>
        </div>
        <div v-if="isDisconnected" class="flex flex-col text-white bg-red-300 font-bold text-lg">
            You've been disconnected
        </div>
        <ChatFeaturesMessageSubmissionForm
            :is-disabled="isTextareaDisabled"
            @message-submitted="sendMessage($event)"
        />
    </UContainer>
</template>
