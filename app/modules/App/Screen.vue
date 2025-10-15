<script setup lang="ts"></script>

<template>
    <div>
        <UDashboardGroup>
            <AppFeaturesChatSelectorSidebar />
        </UDashboardGroup>
        <UMain>
            <slot />
        </UMain>
    </div>
</template>
