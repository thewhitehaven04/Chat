<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import z from 'zod'

const bottomMessage = ref('')

const schema = z.object({
    message: z.string()
})

type TSchema = z.output<typeof schema>

const formState = reactive({
    message: ''
})

const form = useTemplateRef('ai-chat-form')

const handleSubmit = async ({ data }: FormSubmitEvent<TSchema>) => {
    const response = await $fetch('/api/ai-chat', {
        method: 'POST',
        body: data
    })
    bottomMessage.value += response
}

const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey && form) {
        form.value?.submit()
    }
}
</script>
<template>
    <UContainer class="flex flex-col gap-4 h-full">
        <UContainer class="flex-1">
            <p class="w-full wrap-break-word">
                {{ bottomMessage }}
            </p>
        </UContainer>
        <UForm
            ref="ai-chat-form"
            :state="formState"
            :schema="schema"
            @submit="handleSubmit($event)"
        >
            <UFormField name="message">
                <UTextarea
                    v-model="formState.message"
                    class="w-full"
                    placeholder="What do you want to know?"
                    :rows="3"
                    @keyup="handleKeyUp($event)"
                />
            </UFormField>
        </UForm>
    </UContainer>
</template>
