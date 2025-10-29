<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { data: chatRooms } = useFetch('/api/chat/rooms')
const { data: aiChatRooms } = useFetch('/api/ai-chat/rooms')
const { data: profile } = useFetch('/api/profile')

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
                    to: `/chat/${room.id}`
                })) || []
        }
    ]
])
</script>

<template>
    <UDashboardSidebar :collapsible="false" :resizable="false">
        <template #header>
            <span>Multichat</span>
        </template>
        <template #default>
            <UNavigationMenu orientation="vertical" variant="pill" :items="items[0]">
                <template #list-leading>
                    <AppFeaturesComponentsChatRoomCreateButton />
                    <ULink as="button" class="text-green-600" href="/ai-chat">AI chat</ULink>
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
