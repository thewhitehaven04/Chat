<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { data: chatRooms } = useFetch('/api/chat/rooms')
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
            />
        </template>
        <template #footer>
            <div class="flex flex-row gap-4">
                <UAvatar size="md" />
            </div>
            <span>
                {{ user?.email }}
            </span>
        </template>
    </UDashboardSidebar>
</template>
