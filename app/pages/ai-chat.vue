<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import z from 'zod'
import markdownIt from 'markdown-it'

const bottomMessage = ref('')
const md = markdownIt()

const computedMessage = computed(() => md.render(bottomMessage.value))

const hasStartedChatting = ref(false)

const isAnswerPending = ref(false)

const schema = z.object({
    message: z.string()
})

type TSchema = z.output<typeof schema>

const formState = reactive({
    message: ''
})

const form = useTemplateRef('ai-chat-form')

const handleSubmit = async ({ data }: FormSubmitEvent<TSchema>) => {
    isAnswerPending.value = true
    await $fetch('/api/ai-chat', {
        method: 'POST',
        body: data,
        responseType: 'stream',
        onResponse: async ({ response }) => {
            if (response.body) {
                const stream = response.body.pipeThrough(new TextDecoderStream())
                for await (const chunk of stream) {
                    isAnswerPending.value = false
                    bottomMessage.value += chunk
                }
            }
        }
    })
}

const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey && form) {
        form.value?.submit()
        form.value?.clear()
    }
}

</script>
<template>
    <UContainer class="flex flex-col gap-4 h-full">
        <UContainer class="flex-1">
            <div v-if="isAnswerPending">Generating response...</div>
            <div v-else v-html="computedMessage" />
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

<style lang="css" scoped>
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
</style>
