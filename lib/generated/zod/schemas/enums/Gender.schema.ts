import * as z from 'zod';

export const GenderSchema = z.enum(['MALE', 'FEMALE', 'OTHER'])

export type Gender = z.infer<typeof GenderSchema>;