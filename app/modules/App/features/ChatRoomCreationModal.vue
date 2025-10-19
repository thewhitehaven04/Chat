<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import z from 'zod'

defineProps<{
    isOpen: boolean
}>()
const emit = defineEmits<(e: 'chat-created', value: z.output<typeof creationModalSchema>) => void>()

const creationModalSchema = z.object({
    name: z.string().min(3, 'Use a descriptive name that is at least 3 chatacters long'),
    description: z.string().nullable()
})

const formState = reactive({
    name: '',
    description: ''
})

const handleSubmit = (evt: FormSubmitEvent<z.output<typeof creationModalSchema>>) => {
    emit('chat-created', evt.data)
}
</script>

<template>
    <UModal :open="$props.isOpen" title="Create chat room">
        <template #body>
            <UForm
                id="chatRoomCreate"
                class="space-y-4 flex flex-col gap-4"
                :schema="creationModalSchema"
                :state="formState"
                @submit="handleSubmit($event)"
            >
                <UFormField label="Name" name="name">
                    <UInput id="name" v-model="formState.name" type="text" class="w-full" />
                </UFormField>
                <UFormField label="Description" name="description">
                    <UTextarea
                        id="description"
                        v-model="formState.description"
                        type="text"
                        class="w-full"
                    />
                </UFormField>
            </UForm>
        </template>
        <template #footer>
            <div class="flex flex-row justify-end">
                <UButton form="chatRoomCreate" type="submit">Create</UButton>
            </div>
        </template>
    </UModal>
</template>
