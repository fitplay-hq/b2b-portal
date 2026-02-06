import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { LoginTokenUpdateManyMutationInputObjectSchema as LoginTokenUpdateManyMutationInputObjectSchema } from './objects/LoginTokenUpdateManyMutationInput.schema';
import { LoginTokenWhereInputObjectSchema as LoginTokenWhereInputObjectSchema } from './objects/LoginTokenWhereInput.schema';

export const LoginTokenUpdateManySchema: z.ZodType<Prisma.LoginTokenUpdateManyArgs> = z.object({ data: LoginTokenUpdateManyMutationInputObjectSchema, where: LoginTokenWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.LoginTokenUpdateManyArgs>;

export const LoginTokenUpdateManyZodSchema = z.object({ data: LoginTokenUpdateManyMutationInputObjectSchema, where: LoginTokenWhereInputObjectSchema.optional() }).strict();