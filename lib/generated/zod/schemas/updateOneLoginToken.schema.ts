import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { LoginTokenSelectObjectSchema as LoginTokenSelectObjectSchema } from './objects/LoginTokenSelect.schema';
import { LoginTokenUpdateInputObjectSchema as LoginTokenUpdateInputObjectSchema } from './objects/LoginTokenUpdateInput.schema';
import { LoginTokenUncheckedUpdateInputObjectSchema as LoginTokenUncheckedUpdateInputObjectSchema } from './objects/LoginTokenUncheckedUpdateInput.schema';
import { LoginTokenWhereUniqueInputObjectSchema as LoginTokenWhereUniqueInputObjectSchema } from './objects/LoginTokenWhereUniqueInput.schema';

export const LoginTokenUpdateOneSchema: z.ZodType<Prisma.LoginTokenUpdateArgs> = z.object({ select: LoginTokenSelectObjectSchema.optional(),  data: z.union([LoginTokenUpdateInputObjectSchema, LoginTokenUncheckedUpdateInputObjectSchema]), where: LoginTokenWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.LoginTokenUpdateArgs>;

export const LoginTokenUpdateOneZodSchema = z.object({ select: LoginTokenSelectObjectSchema.optional(),  data: z.union([LoginTokenUpdateInputObjectSchema, LoginTokenUncheckedUpdateInputObjectSchema]), where: LoginTokenWhereUniqueInputObjectSchema }).strict();