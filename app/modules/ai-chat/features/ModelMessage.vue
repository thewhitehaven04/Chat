<script setup lang="ts">
import md from 'markdown-it'

defineProps<{ mdRawString: string }>()

const markdown = new md()
</script>

<template>
    <div v-html="markdown.render($props.mdRawString)" />
</template>
