<script setup lang="ts">
import { format } from 'date-fns'
import type { IMessageSequenceProps } from '~/modules/chat/models/types'
defineProps<IMessageSequenceProps>()
</script>

<template>
    <div class="grid-message-container">
        <div class="flex flex-row gap-2 grid-sender">
            <UPopover :open="false" mode="hover">
                <template #anchor>
                    <span class="text-primary-500">{{ $props.submittedBy.name }}</span>
                </template>
                <template #default>
                    <div class="flex flex-row items-start gap-2">
                        <div class="flex flex-row gap-2 items-baseline">
                            <div class="hover:underline text-primary-700 font-medium">{{ $props.submittedBy.name }}</div>
                            <div class="text-neutral-500 text-xs">
                                {{ format($props.messages[0]!.submittedAt, 'MMM dd HH:mm:ss') }}
                            </div>
                        </div>
                    </div>
                </template>
            </UPopover>
        </div>
        <ul class="grid-text">
            <li v-for="m in $props.messages" :key="m.text">
                {{ m.text }}
            </li>
        </ul>
        <UAvatar size="lg" class="grid-avatar" :src="$props.avatarUrl ?? undefined" />
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
