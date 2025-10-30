<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { data: chatRooms } = useFetch('/api/chat/rooms', {
    key: 'chatRooms'
})
const { data: aiChatRooms } = useFetch('/api/ai-chat/rooms', {
    key: 'aiChatRooms'
})
const { data: profile } = useFetch('/api/profile', { key: 'profile' })

const items: ComputedRef<NavigationMenuItem[][]> = computed(() => [
    [
        {
            label: 'Chats',
            icon: 'i-lucide-message-circle',
            defaultOpen: true,
            children:
                chatRooms.value?.map((room) => ({
                    label: room.name,
                    to: `/chat/${room.id}`
                })) || []
        },
        {
            label: 'AI Chats',
            icon: 'i-lucide-brain-circuit',
            defaultOpen: true,
            children:
                aiChatRooms.value?.map((room) => ({
                    label: room.name,
                    to: `/ai-chat/${room.id}`
                })) || []
        }
    ]
])
</script>

<template>
    <UDashboardSidebar :collapsible="false" :resizable="false">
        <template #header>
            <h1 class="text-lg">Multichat</h1>
        </template>
        <template #default>
            <UNavigationMenu orientation="vertical" variant="pill" :items="items[0]">
                <template #list-leading>
                    <AppFeaturesComponentsChatRoomCreateButton />
                    <UButton variant="soft" href="/ai-chat" icon="i-lucide-bot"
                        >Chat with AI</UButton
                    >
                </template>
            </UNavigationMenu>
        </template>
        <template #footer>
            <div class="flex flex-col gap-2 w-full">
                <div class="flex flex-row gap-4 items-center">
                    <UAvatar size="md" :src="profile?.avatarUrl ?? undefined" />
                    <ULink href="/profile" class="overflow-ellipsis w-full">
                        {{ profile?.name }}
                    </ULink>
                </div>
                <AppFeaturesComponentsLogoutButton />
            </div>
        </template>
    </UDashboardSidebar>
</template>
