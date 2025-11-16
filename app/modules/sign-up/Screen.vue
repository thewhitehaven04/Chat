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
            .nonoptional(),
        name: z.string().min(2, 'The name must be at least 2 characters long').nonoptional()
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: 'Passwords do not match'
    })
type Schema = z.output<typeof schema>

const formState = reactive<Partial<Schema>>({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
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
                <UFormField label="Nickname" name="name">
                    <UInput id="name" v-model="formState.name" type="text" class="w-full" />
                </UFormField>
                <UButton label="Sign Up" type="submit" color="neutral" block />
            </UForm>
        </template>
        <template #footer>
            <div class="flex flex-row items-center justify-between w-full">
                <div>Already have an account?</div>
                <NuxtLink :to="{ path: '/sign-in' }">
                    <UButton variant="link" label="Sign in" color="neutral" />
                </NuxtLink>
            </div>
        </template>
    </UModal>
</template>
