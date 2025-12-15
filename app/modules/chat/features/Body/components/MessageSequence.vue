<script setup lang="ts">
import { format } from 'date-fns'
import type { TChat } from '~/modules/chat/composables/useChat'
import type { IChatMessageGroup } from '~~/server/modules/chat/models/types'
defineProps<IChatMessageGroup>()

const containerRef = useTemplateRef('root')
const chat = inject<TChat>('chat')

defineExpose({
    containerRef
})
</script>

<template>
    <div ref="root" class="grid-message-container">
        <div class="flex flex-row gap-2 grid-sender">
            <UPopover :open="false" mode="hover">
                <template #anchor>
                    <span class="text-primary-500">{{ $props.submitted_by.name }}</span>
                </template>

                <template #default>
                    <div class="flex flex-row items-start gap-2">
                        <div class="flex flex-row gap-2 items-baseline">
                            <div class="hover:underline text-primary-700 font-medium">
                                {{ $props.submitted_by.name }}
                            </div>
                            <div class="text-neutral-500 text-xs">
                                {{ format($props.messages[0]!.submitted_at, 'MMM dd HH:mm:ss') }}
                            </div>
                        </div>
                    </div>
                </template>
            </UPopover>
        </div>
        <ul class="grid-text w-full overflow-x-visible">
            <UPopover
                v-for="message in $props.messages"
                :key="message.id"
                mode="hover"
                :content="{
                    side: 'top',
                    align: 'end',
                    alignOffset: 24
                }"
            >
                <template #content>
                    <UButton
                        icon="i-lucide-trash"
                        size="xs"
                        variant="ghost"
                        color="neutral"
                        @click="chat?.deleteMessage(message.id)"
                    />
                    <UButton
                        icon="i-lucide-pencil"
                        size="xs"
                        variant="ghost"
                        color="neutral"
                        @click="chat?.setEditingMessage(message.id)"
                    />
                </template>

                <li
                    :id="message.id"
                    class="hover:bg-neutral-100 dark:hover:bg-neutral-800 min-h-8 relative after:text-xs flex flex-col"
                    @click="chat?.setIsRespondingTo(message.id)"
                >
                    <div v-if="!!message.respondsTo" class="flex flex-row">
                        <ULink class="text-neutral-500" :to="`#${message.respondsTo.id}`">
                            <div class="flex flex-row gap-1 items-center w-full">
                                <UIcon name="i-lucide-corner-up-right" />
                                <div class="text-neutral text-ellipsis max-w-full">
                                    {{ message.respondsTo.text }}
                                </div>
                            </div>
                        </ULink>
                    </div>
                    <p>
                        {{ message.text }}
                    </p>
                </li>
            </UPopover>
        </ul>
        <UAvatar size="xl" class="grid-avatar" :src="$props.submitted_by.avatarUrl ?? undefined" />
    </div>
</template>

<style scoped>
.grid-message-container {
    display: grid;
    grid-template-columns: 48px 1fr;
    grid-template-rows: min-content minmax(1rem, 1fr);
    column-gap: 8px;
    width: 100%;
    align-items: start;
}

li:hover::after {
    position: absolute;
    right: 64px;
    content: attr(data-content);
}

.grid-avatar {
    grid-column: 1;
    grid-row: 1 / span 2;
}

.grid-sender {
    grid-column: 2;
    grid-row: 1;
}

.grid-text {
    grid-column: 2;
    grid-row: 2;
}
</style>
