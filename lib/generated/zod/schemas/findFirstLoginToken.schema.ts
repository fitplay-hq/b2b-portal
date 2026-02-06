import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { LoginTokenOrderByWithRelationInputObjectSchema as LoginTokenOrderByWithRelationInputObjectSchema } from './objects/LoginTokenOrderByWithRelationInput.schema';
import { LoginTokenWhereInputObjectSchema as LoginTokenWhereInputObjectSchema } from './objects/LoginTokenWhereInput.schema';
import { LoginTokenWhereUniqueInputObjectSchema as LoginTokenWhereUniqueInputObjectSchema } from './objects/LoginTokenWhereUniqueInput.schema';
import { LoginTokenScalarFieldEnumSchema } from './enums/LoginTokenScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const LoginTokenFindFirstSelectSchema: z.ZodType<Prisma.LoginTokenSelect> = z.object({
    id: z.boolean().optional(),
    token: z.boolean().optional(),
    identifier: z.boolean().optional(),
    password: z.boolean().optional(),
    userId: z.boolean().optional(),
    userType: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    expires: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.LoginTokenSelect>;

export const LoginTokenFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    token: z.boolean().optional(),
    identifier: z.boolean().optional(),
    password: z.boolean().optional(),
    userId: z.boolean().optional(),
    userType: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    expires: z.boolean().optional()
  }).strict();

export const LoginTokenFindFirstSchema: z.ZodType<Prisma.LoginTokenFindFirstArgs> = z.object({ select: LoginTokenFindFirstSelectSchema.optional(),  orderBy: z.union([LoginTokenOrderByWithRelationInputObjectSchema, LoginTokenOrderByWithRelationInputObjectSchema.array()]).optional(), where: LoginTokenWhereInputObjectSchema.optional(), cursor: LoginTokenWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([LoginTokenScalarFieldEnumSchema, LoginTokenScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.LoginTokenFindFirstArgs>;

export const LoginTokenFindFirstZodSchema = z.object({ select: LoginTokenFindFirstSelectSchema.optional(),  orderBy: z.union([LoginTokenOrderByWithRelationInputObjectSchema, LoginTokenOrderByWithRelationInputObjectSchema.array()]).optional(), where: LoginTokenWhereInputObjectSchema.optional(), cursor: LoginTokenWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([LoginTokenScalarFieldEnumSchema, LoginTokenScalarFieldEnumSchema.array()]).optional() }).strict();