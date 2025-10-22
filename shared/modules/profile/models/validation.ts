import z from 'zod'

export const profileUpdateValidation = z
    .object({
        name: z.string().min(2, 'The name must be at least 2 characters long'),
        avatar: z
            .instanceof(File, { error: 'Avatar must be a file' })
            .refine((file) => file.size < 2e8, {
                error: 'Avatar must be less than 2MB'
            })
    })
    .partial()

export type TProfileUpdateDto = z.output<typeof profileUpdateValidation>
