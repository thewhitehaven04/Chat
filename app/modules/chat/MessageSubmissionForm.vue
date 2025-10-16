<script setup lang="ts">
import z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const emit = defineEmits(['submitMessage'])

const schema = z.object({
    message: z.string().min(1)
})

const formState = reactive({
    message: ''
})

const sendMessage = (message: string) => {
    emit('submitMessage', message)
    formState.message = ''
}

const handleSubmit = (evt: FormSubmitEvent<z.output<typeof schema>>) => {
    sendMessage(evt.data.message)
}

const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        sendMessage(formState.message)
    }
}
</script>

<template>
    <UForm :state="formState" :schema="schema" @submit="handleSubmit">
        <div class="flex flex-col items-center w-full gap-2">
            <UTextarea
                name="message"
                class="w-full"
                placeholder="What do you think?"
                :rows="4"
                autoresize
                @keyup="handleKeyUp"
            />
            <UButton type="submit">Send</UButton>
        </div>
    </UForm>
</template>
