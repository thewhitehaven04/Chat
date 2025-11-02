<script setup lang="ts">
import md from 'markdown-it'
import type { IChatMessageProps } from '~/modules/ai-chat/features/types'

defineProps<IChatMessageProps>()
const markdown = new md()
const container = useTemplateRef('container')

defineExpose<{
    container: typeof container
}>({
    container
})
</script>

<template>
    <div ref="container">
        <div v-if="$props.type === 'user'" class="flex flex-row justify-end w-full">
            <div class="bg-neutral-200 rounded-lg p-4 max-w-3xl w-max">
                <p>{{ $props.message }}</p>
            </div>
        </div>
        <div v-else ref="" class="flex flex-row justify-start w-full">
            <div
                class="bg-neutral-100 rounded-lg p-4 max-w-3xl w-max"
                v-html="markdown.render($props.message)"
            />
        </div>
    </div>
</template>
