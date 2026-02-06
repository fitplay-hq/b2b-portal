import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { LoginTokenWhereInputObjectSchema as LoginTokenWhereInputObjectSchema } from './objects/LoginTokenWhereInput.schema';

export const LoginTokenDeleteManySchema: z.ZodType<Prisma.LoginTokenDeleteManyArgs> = z.object({ where: LoginTokenWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.LoginTokenDeleteManyArgs>;

export const LoginTokenDeleteManyZodSchema = z.object({ where: LoginTokenWhereInputObjectSchema.optional() }).strict();