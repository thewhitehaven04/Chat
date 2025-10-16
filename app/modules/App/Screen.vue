<script setup lang="ts"></script>

<template>
    <div>
        <UDashboardGroup>
            <AppFeaturesChatSelectorSidebar />
            <UMain class="w-full py-4">
                <slot />
            </UMain>
        </UDashboardGroup>
    </div>
</template>
