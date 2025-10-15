<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { data } = useFetch('/api/chat/rooms')

const items: ComputedRef<NavigationMenuItem[][]> = computed(() => [
    [
        {
            label: 'Chats',
            icon: 'i-lucide-message-circle',
            defaultOpen: true,
            children: data.value?.map((room) => ({
                label: room.name,
                to: `/chat/${room.id}`
            }))
        }
    ]
])
</script>

<template>
    <UDashboardSidebar>
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
    </UDashboardSidebar>
</template>
