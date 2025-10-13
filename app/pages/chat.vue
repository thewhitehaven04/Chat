<script setup lang="ts">
definePageMeta({
    layout: 'authorized'
})

const isPending = ref(true)

const connection = new WebSocket('')

connection.addEventListener('open', () => {
    isPending.value = false
})

const message = defineModel<string>('message')

const handleSubmit = () => {}
</script>

<template>
    <div class="flex flex-col justify-start h-full">
        <div class="h-full">
            <div v-if="isPending" class="flex items-center justify-center h-full">
                <USpinner />
            </div>
        </div>
        <div class="h-48">
            <UForm @submit="handleSubmit">
                <UTextarea v-model="message" name="message" />
            </UForm>
        </div>
    </div>
</template>
