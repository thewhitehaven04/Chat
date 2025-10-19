<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import type { IChatCreateDto } from '~~/server/modules/chats/models/types'

const { data: chatRooms, refresh: refreshChatRooms } = useFetch('/api/chat/rooms')
const { data: user } = useFetch('/api/user')

const items: ComputedRef<NavigationMenuItem[][]> = computed(() => [
    [
        {
            label: 'Chats',
            icon: 'i-lucide-message-circle',
            defaultOpen: true,
            children: chatRooms.value?.map((room) => ({
                label: room.name,
                to: `/chat/${room.id}`
            }))
        }
    ]
])

const isCreateModalOpen = ref(false)

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
    isCreateModalOpen.value = false
}
const handleChatCreateOpen = () => {
    isCreateModalOpen.value = true
}
</script>

<template>
    <UDashboardSidebar :collapsible="false" :resizable="false">
        <template #header>
            <span>Multichat</span>
        </template>
        <template #default="{ collapsed }">
            <UNavigationMenu
                orientation="vertical"
                :collapsed="collapsed"
                variant="pill"
                :items="items[0]"
            >
                <template #list-leading>
                    <UButton variant="soft" @click="handleChatCreateOpen()"
                        >Create chat room</UButton
                    >
                </template>
            </UNavigationMenu>
        </template>
        <template #footer>
            <div class="flex flex-row gap-4">
                <UAvatar size="md" />
            </div>
            <div class="overflow-ellipsis w-full">
                {{ user?.email }}
            </div>
        </template>
    </UDashboardSidebar>
    <AppFeaturesChatRoomCreationModal
        :is-open="isCreateModalOpen"
        @chat-created="handleChatCreate($event)"
    />
</template>
