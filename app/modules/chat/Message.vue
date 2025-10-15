<script setup lang="ts">
import { format } from 'date-fns'
const props = defineProps<{
    submittedAt: string
    submittedBy: string
    text: string
}>()

const currentUser = ref('You')

const isCurrentUser = computed(() => props.submittedBy === currentUser.value)
</script>

<template>
    <div class="flex items-start gap-2" :class="{ 'justify-end': isCurrentUser }">
        <UAvatar v-if="!isCurrentUser" :alt="props.submittedBy" size="sm" />

        <UCard
            class="max-w-[70%]"
            :class="{
                'bg-primary-500 text-white': isCurrentUser,
                'bg-gray-100 dark:bg-gray-700': !isCurrentUser
            }"
        >
            <p class="text-sm px-3 py-2">{{ text }}</p>
            <div
                class="text-xs text-right mt-1 px-3 py-2"
                :class="{
                    'text-gray-200': isCurrentUser,
                    'text-gray-500 dark:text-gray-400': !isCurrentUser
                }"
            >
                {{ props.submittedBy }} at {{ format(submittedAt, 'hh:mm') }}
            </div>
        </UCard>

        <UAvatar v-if="isCurrentUser" :alt="props.submittedBy" size="sm" />
    </div>
</template>
