import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { LoginTokenCreateManyInputObjectSchema as LoginTokenCreateManyInputObjectSchema } from './objects/LoginTokenCreateManyInput.schema';

export const LoginTokenCreateManySchema: z.ZodType<Prisma.LoginTokenCreateManyArgs> = z.object({ data: z.union([ LoginTokenCreateManyInputObjectSchema, z.array(LoginTokenCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.LoginTokenCreateManyArgs>;

export const LoginTokenCreateManyZodSchema = z.object({ data: z.union([ LoginTokenCreateManyInputObjectSchema, z.array(LoginTokenCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();