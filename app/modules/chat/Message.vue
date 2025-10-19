<script setup lang="ts">
import { format } from 'date-fns'
const props = defineProps<{
    submittedAt: string
    submittedBy: string
    avatarUrl: string | null
    text: string
}>()
</script>

<template>
    <div class="grid-message-container">
        <UAvatar class="grid-avatar" size="3xl" />
        <div class="flex flex-row gap-2 grid-sender">
            <UPopover>
                <template #anchor>
                    {{ props.submittedBy }}
                </template>
                <div class="flex flex-row gap-2">
                    <UAvatar :src="props.avatarUrl ?? undefined" />
                    {{ props.submittedBy }}
                </div>
            </UPopover>
            <span class="text-neutral-500 text-sm">{{
                format(props.submittedAt, 'dd:MM HH:mm:ss')
            }}</span>
        </div>
        <p class="grid-text">{{ props.text }}</p>
    </div>
</template>

<style scoped>
.grid-message-container {
    display: grid;
    grid-template-columns: 48px 1fr;
    grid-template-rows: min-content 1fr;
    column-gap: 8px;
    width: 100%;
}

.grid-avatar {
    grid-column: 1;
    grid-row: 1 / span 2;
    align-self: start;
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
