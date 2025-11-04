
<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import {
    profileUpdateValidation,
    type TProfileUpdateDto
} from '~~/shared/modules/profile/models/validation'
const isEditing = ref(false)

const { data: profile, refresh } = useFetch('/api/profile', {
    key: 'profile'
})

watch(profile, () => {
    if (profile.value) {
        formState.name = profile.value.name
    }
})

const toggleEdit = () => {
    isEditing.value = !isEditing.value
}

const formState = reactive<TProfileUpdateDto>({
    name: undefined,
    avatar: undefined
})

const handleSubmit = async ({ data }: FormSubmitEvent<TProfileUpdateDto>) => {
    const formData = new FormData()
    if (data.name) {
        formData.append('name', data.name)
    }
    if (data.avatar) {
        formData.append('avatar', data.avatar)
    }

    await $fetch('/api/profile', {
        method: 'PUT',
        body: formData,
        onResponse: ({ error }) => {
            if (!error) {
                toggleEdit()
                refresh()
            }
        }
    })
}

const getAvatarUrl = (file: File) => {
    return URL.createObjectURL(file)
}
</script>

<template>
    <UContainer class="w-full h-full">
        <UCard>
            <template #header>
                <div class="flex flex-row justify-between">
                    <h1 class="text-xl font-medium">Profile Settings</h1>
                    <div v-if="isEditing" class="flex flex-row gap-2">
                        <UButton
                            label="Cancel"
                            variant="ghost"
                            color="error"
                            @click="toggleEdit()"
                        />
                        <UButton form="profile" label="Submit" variant="ghost" type="submit" />
                    </div>
                    <UButton v-else icon="i-lucide-pencil" variant="ghost" @click="toggleEdit()" />
                </div>
            </template>
            <div class="flex flex-col gap-2">
                <UForm
                    id="profile"
                    :schema="profileUpdateValidation"
                    :state="formState"
                    class="flex flex-col gap-2 items-start"
                    @submit="handleSubmit"
                >
                    <UFormField name="name" label="Name">
                        <UInput v-model="formState.name" :disabled="!isEditing" />
                    </UFormField>
                    <UFormField name="avatar">
                        <UFileUpload
                            v-slot="{ open, removeFile }"
                            v-model="formState.avatar"
                            label="Drop your image here"
                            description="WEBP, JPG"
                            class="flex flex-col items-start gap-4"
                            accept="image/jpg, image/webp"
                        >
                            <img
                                class="w-48 h-48 rounded-2xl border-[1px] border-[#0001]"
                                :src="
                                    formState.avatar
                                        ? getAvatarUrl(formState.avatar)
                                        : (profile?.avatarUrl ?? undefined)
                                "
                            >
                            <div v-if="isEditing" class="flex flex-row gap-4">
                                <UButton variant="soft" @click="open()">Upload</UButton>
                                <UButton variant="soft" @click="removeFile()">Remove</UButton>
                            </div>
                        </UFileUpload>
                    </UFormField>
                </UForm>
            </div>
        </UCard>
    </UContainer>
</template>