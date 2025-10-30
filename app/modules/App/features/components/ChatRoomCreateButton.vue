<script setup lang="ts">
import z from 'zod'
import { useBoolean } from '~/shared/composables/useBoolean'
import type { IChatCreateDto } from '~~/server/modules/chat-rooms/models/types'

const { val: isModalOpen, toggle: toggleModal } = useBoolean()

const { refresh: refreshChatRooms } = useFetch('/api/chat/rooms')

const creationModalSchema = z.object({
    name: z.string().min(3, 'Use a descriptive name that is at least 3 chatacters long'),
    description: z.string().nullable()
})

const formState = reactive({
    name: '',
    description: ''
})

const handleChatCreate = async (data: IChatCreateDto) => {
    await $fetch('/api/chat/room', {
        method: 'POST',
        body: data,
        onResponse: ({ error }) => {
            if (!error) {
                refreshChatRooms()
            }
        }
    })
    toggleModal()
}
</script>

<template>
    <UButton variant="soft" @click="toggleModal()">
        <UIcon name="i-lucide-message-circle" />
        Create chat room
    </UButton>
    <UModal
        :open="isModalOpen"
        title="Create chat room"
        :close="{
            onClick: toggleModal
        }"
    >
        <template #body>
            <UForm
                id="chatRoomCreate"
                class="space-y-4 flex flex-col gap-4"
                :schema="creationModalSchema"
                :state="formState"
                @submit="handleChatCreate($event)"
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
