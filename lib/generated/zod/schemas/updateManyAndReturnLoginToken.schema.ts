import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { LoginTokenSelectObjectSchema as LoginTokenSelectObjectSchema } from './objects/LoginTokenSelect.schema';
import { LoginTokenUpdateManyMutationInputObjectSchema as LoginTokenUpdateManyMutationInputObjectSchema } from './objects/LoginTokenUpdateManyMutationInput.schema';
import { LoginTokenWhereInputObjectSchema as LoginTokenWhereInputObjectSchema } from './objects/LoginTokenWhereInput.schema';

export const LoginTokenUpdateManyAndReturnSchema: z.ZodType<Prisma.LoginTokenUpdateManyAndReturnArgs> = z.object({ select: LoginTokenSelectObjectSchema.optional(), data: LoginTokenUpdateManyMutationInputObjectSchema, where: LoginTokenWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.LoginTokenUpdateManyAndReturnArgs>;

export const LoginTokenUpdateManyAndReturnZodSchema = z.object({ select: LoginTokenSelectObjectSchema.optional(), data: LoginTokenUpdateManyMutationInputObjectSchema, where: LoginTokenWhereInputObjectSchema.optional() }).strict();