<script setup lang="ts">
import md from 'markdown-it'
import type { TAIChatMessageProps } from './types'

defineProps<TAIChatMessageProps>()
const markdown = new md()
const container = useTemplateRef('container')

defineExpose<{
    container: typeof container
}>({
    container
})
</script>

<template>
    <div ref="container" class="text-neutral-700 dark:text-neutral-300">
        <div
            v-if="$props.type === 'userToModel'"
            class="flex flex-row justify-end w-full"
        >
            <div class="bg-accented rounded-lg p-4 max-w-3xl w-max">
                <p>{{ $props.message }}</p>
            </div>
        </div>
        <div v-else class="flex flex-row justify-start w-full">
            <div
                class="bg-accented dark:bg-blue-400 rounded-lg p-4 max-w-3xl w-max"
                v-html="markdown.render($props.message)"
            />
        </div>
    </div>
</template>
