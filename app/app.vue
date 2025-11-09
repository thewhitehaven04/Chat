<script>
// useHead({
//     titleTemplate: (titleChunk) => {
//         return titleChunk ? `${titleChunk} | Multichat` : 'Multichat'
//     },
//     meta: [
//         {
//             name: 'description',
//             content: 'Multichat - your communication and AI chat app'
//         }
//     ]
// })
</script>

<template>
    <UApp>
        <NuxtLoadingIndicator />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>
