<script setup lang="ts">
defineProps<{
    text: string | null
}>()

</script>

<template>
    <div v-if="!!$props.text" class="flex flex-row items-center gap-1 hover:text-neutral-500">
        <UIcon name="i-lucide-corner-up-right"/>
        <div class="text-neutral text-ellipsis max-w-full">{{ $props.text }}</div>
    </div>
</template>