<script setup lang="ts">
import { useSupabaseClient } from '~/shared/composables/useSupabaseClient'

const supabase = useSupabaseClient()

const handleLogout = async () => {
    await supabase.auth.signOut()
}
</script>

<template>
    <UButton
        type="button"
        variant="ghost"
        color="error"
        class="w-full"
        icon="i-lucide-log-out"
        to="/sign-in"
        @click="handleLogout()"
        >Logout</UButton
    >
</template>
