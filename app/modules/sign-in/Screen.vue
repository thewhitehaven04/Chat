<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'
import { useSupabaseClient } from '~/shared/composables/useSupabaseClient'

const schema = z.object({
    email: z.email('Incorrect e-mail format'),
    password: z.string().min(8, 'Password must be at least 8 characters')
})

const formState = reactive({
    email: '',
    password: ''
})

const router = useRouter()
const { auth } = useSupabaseClient()

const handleSubmit = async ({ data }: FormSubmitEvent<z.output<typeof schema>>) => {
    await auth.signInWithPassword({
        email: data.email,
        password: data.password
    })
    router.push('/')
}
</script>

<template>
    <UModal :open="true" :overlay="true" title="Sign in">
        <template #body>
            <UForm class="space-y-4" :schema="schema" :state="formState" @submit="handleSubmit">
                <UFormField label="Email" name="email">
                    <UInput
                        id="email"
                        v-model="formState.email"
                        type="email"
                        placeholder="you@example.com"
                        class="w-full"
                    />
                </UFormField>
                <UFormField label="Password" name="password">
                    <UInput
                        id="password"
                        v-model="formState.password"
                        type="password"
                        placeholder="********"
                        class="w-full"
                    />
                </UFormField>
                <UButton label="Sign In" color="neutral" type="submit" />
            </UForm>
        </template>
        <template #footer>
            <div class="flex flex-row items-center justify-between w-full">
                <div>Don't have an account?</div>
                <NuxtLink :to="{ path: '/sign-up' }">
                    <UButton variant="link" color="neutral" label="Sign up" />
                </NuxtLink>
            </div>
        </template>
    </UModal>
</template>
