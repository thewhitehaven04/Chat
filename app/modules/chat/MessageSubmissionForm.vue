<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'

const emit = defineEmits<(e: 'message-submitted', value: string) => void>()
const form = useTemplateRef('form')

const formState = reactive({
    message: ''
})

const handleSubmit = (evt: FormSubmitEvent<{ message: string }>) => {
    emit('message-submitted', evt.data.message)
    formState.message = ''
}

const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        form.value?.submit()
    }
}
</script>

<template>
    <UForm ref="form" :state="formState" @submit="handleSubmit($event)">
        <UFormField name="message">
            <UTextarea
                v-model="formState.message"
                class="w-full"
                placeholder="What do you think?"
                :rows="4"
                autoresize
                @keyup="handleKeyUp($event)"
            />
        </UFormField>
    </UForm>
</template>
