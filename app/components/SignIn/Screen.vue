<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

const schema = z.object({
    email: z.email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters')
})

const formState = reactive({
    email: '',
    password: ''
})

const handleSubmit = async ({ data }: FormSubmitEvent<z.infer<typeof schema>>) => {
    await $fetch('/api/sign-in', {
        method: 'POST',
        body: data
    })
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
                    />
                </UFormField>
                <UFormField label="Password" name="password">
                    <UInput
                        id="password"
                        v-model="formState.password"
                        type="password"
                        placeholder="********"
                    />
                </UFormField>
                <UButton label="Sign In" type="submit" />
            </UForm>
        </template>
    </UModal>
</template>
