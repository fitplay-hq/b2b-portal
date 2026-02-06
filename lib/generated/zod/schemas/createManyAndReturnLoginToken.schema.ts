import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { LoginTokenSelectObjectSchema as LoginTokenSelectObjectSchema } from './objects/LoginTokenSelect.schema';
import { LoginTokenCreateManyInputObjectSchema as LoginTokenCreateManyInputObjectSchema } from './objects/LoginTokenCreateManyInput.schema';

export const LoginTokenCreateManyAndReturnSchema: z.ZodType<Prisma.LoginTokenCreateManyAndReturnArgs> = z.object({ select: LoginTokenSelectObjectSchema.optional(), data: z.union([ LoginTokenCreateManyInputObjectSchema, z.array(LoginTokenCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.LoginTokenCreateManyAndReturnArgs>;

export const LoginTokenCreateManyAndReturnZodSchema = z.object({ select: LoginTokenSelectObjectSchema.optional(), data: z.union([ LoginTokenCreateManyInputObjectSchema, z.array(LoginTokenCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();