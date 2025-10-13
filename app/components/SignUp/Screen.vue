<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const schema = z
    .object({
        email: z.email().nonoptional(),
        password: z
            .string()
            .min(8, { error: 'Password must be at least 8 characters' })
            .nonoptional(),
        confirmPassword: z
            .string()
            .min(8, {
                error: 'Password must be at least 8 characters'
            })
            .nonoptional()
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: 'Passwords do not match'
    })
type Schema = z.output<typeof schema>

const formState = reactive<Partial<Schema>>({
    email: undefined,
    password: undefined,
    confirmPassword: undefined
})

const router = useRouter()

const handleSubmit = async (evt: FormSubmitEvent<Schema>) => {
    const { success } = await $fetch('/api/sign-up', {
        method: 'POST',
        body: evt.data
    })
    if (success) {
        router.push('/sign-in')
    }
}
</script>

<template>
    <UModal :open="true" :overlay="true" title="Sign in">
        <template #body>
            <UForm class="space-y-4" :state="formState" :schema="schema" @submit="handleSubmit">
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
                <UFormField label="Confirm Password" name="confirmPassword">
                    <UInput
                        id="confirmPassword"
                        v-model="formState.confirmPassword"
                        type="password"
                        placeholder="********"
                        class="w-full"
                    />
                </UFormField>
                <UButton label="Sign Up" type="submit" block />
            </UForm>
        </template>
    </UModal>
</template>
