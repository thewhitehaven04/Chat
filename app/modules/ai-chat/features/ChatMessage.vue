<script setup lang="ts">
import md from 'markdown-it'
import type { IChatMessageProps } from '~/modules/ai-chat/features/types'

defineProps<IChatMessageProps>()

const markdown = new md()
</script>

<template>
    <div v-if="$props.type === 'user'" class="flex flex-row justify-end w-full">
        <div class="bg-neutral-200 rounded-lg p-4 w-4/5">
            <p>{{ $props.message }}</p>
        </div>
    </div>
    <div v-else class="flex flex-row justify-start w-full">
        <div
            class="bg-neutral-100 rounded-lg p-4 w-4/5"
            v-html="markdown.render($props.message)"
        />
    </div>
</template>
