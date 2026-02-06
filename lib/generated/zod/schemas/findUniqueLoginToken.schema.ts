import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { LoginTokenSelectObjectSchema as LoginTokenSelectObjectSchema } from './objects/LoginTokenSelect.schema';
import { LoginTokenWhereUniqueInputObjectSchema as LoginTokenWhereUniqueInputObjectSchema } from './objects/LoginTokenWhereUniqueInput.schema';

export const LoginTokenFindUniqueSchema: z.ZodType<Prisma.LoginTokenFindUniqueArgs> = z.object({ select: LoginTokenSelectObjectSchema.optional(),  where: LoginTokenWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.LoginTokenFindUniqueArgs>;

export const LoginTokenFindUniqueZodSchema = z.object({ select: LoginTokenSelectObjectSchema.optional(),  where: LoginTokenWhereUniqueInputObjectSchema }).strict();