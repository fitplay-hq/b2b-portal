import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { LoginTokenSelectObjectSchema as LoginTokenSelectObjectSchema } from './objects/LoginTokenSelect.schema';
import { LoginTokenWhereUniqueInputObjectSchema as LoginTokenWhereUniqueInputObjectSchema } from './objects/LoginTokenWhereUniqueInput.schema';

export const LoginTokenDeleteOneSchema: z.ZodType<Prisma.LoginTokenDeleteArgs> = z.object({ select: LoginTokenSelectObjectSchema.optional(),  where: LoginTokenWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.LoginTokenDeleteArgs>;

export const LoginTokenDeleteOneZodSchema = z.object({ select: LoginTokenSelectObjectSchema.optional(),  where: LoginTokenWhereUniqueInputObjectSchema }).strict();