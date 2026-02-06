import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { LoginTokenSelectObjectSchema as LoginTokenSelectObjectSchema } from './objects/LoginTokenSelect.schema';
import { LoginTokenWhereUniqueInputObjectSchema as LoginTokenWhereUniqueInputObjectSchema } from './objects/LoginTokenWhereUniqueInput.schema';
import { LoginTokenCreateInputObjectSchema as LoginTokenCreateInputObjectSchema } from './objects/LoginTokenCreateInput.schema';
import { LoginTokenUncheckedCreateInputObjectSchema as LoginTokenUncheckedCreateInputObjectSchema } from './objects/LoginTokenUncheckedCreateInput.schema';
import { LoginTokenUpdateInputObjectSchema as LoginTokenUpdateInputObjectSchema } from './objects/LoginTokenUpdateInput.schema';
import { LoginTokenUncheckedUpdateInputObjectSchema as LoginTokenUncheckedUpdateInputObjectSchema } from './objects/LoginTokenUncheckedUpdateInput.schema';

export const LoginTokenUpsertOneSchema: z.ZodType<Prisma.LoginTokenUpsertArgs> = z.object({ select: LoginTokenSelectObjectSchema.optional(),  where: LoginTokenWhereUniqueInputObjectSchema, create: z.union([ LoginTokenCreateInputObjectSchema, LoginTokenUncheckedCreateInputObjectSchema ]), update: z.union([ LoginTokenUpdateInputObjectSchema, LoginTokenUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.LoginTokenUpsertArgs>;

export const LoginTokenUpsertOneZodSchema = z.object({ select: LoginTokenSelectObjectSchema.optional(),  where: LoginTokenWhereUniqueInputObjectSchema, create: z.union([ LoginTokenCreateInputObjectSchema, LoginTokenUncheckedCreateInputObjectSchema ]), update: z.union([ LoginTokenUpdateInputObjectSchema, LoginTokenUncheckedUpdateInputObjectSchema ]) }).strict();