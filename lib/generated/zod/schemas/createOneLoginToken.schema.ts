import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { LoginTokenSelectObjectSchema as LoginTokenSelectObjectSchema } from './objects/LoginTokenSelect.schema';
import { LoginTokenCreateInputObjectSchema as LoginTokenCreateInputObjectSchema } from './objects/LoginTokenCreateInput.schema';
import { LoginTokenUncheckedCreateInputObjectSchema as LoginTokenUncheckedCreateInputObjectSchema } from './objects/LoginTokenUncheckedCreateInput.schema';

export const LoginTokenCreateOneSchema: z.ZodType<Prisma.LoginTokenCreateArgs> = z.object({ select: LoginTokenSelectObjectSchema.optional(),  data: z.union([LoginTokenCreateInputObjectSchema, LoginTokenUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.LoginTokenCreateArgs>;

export const LoginTokenCreateOneZodSchema = z.object({ select: LoginTokenSelectObjectSchema.optional(),  data: z.union([LoginTokenCreateInputObjectSchema, LoginTokenUncheckedCreateInputObjectSchema]) }).strict();