import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { LoginTokenOrderByWithRelationInputObjectSchema as LoginTokenOrderByWithRelationInputObjectSchema } from './objects/LoginTokenOrderByWithRelationInput.schema';
import { LoginTokenWhereInputObjectSchema as LoginTokenWhereInputObjectSchema } from './objects/LoginTokenWhereInput.schema';
import { LoginTokenWhereUniqueInputObjectSchema as LoginTokenWhereUniqueInputObjectSchema } from './objects/LoginTokenWhereUniqueInput.schema';
import { LoginTokenScalarFieldEnumSchema } from './enums/LoginTokenScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const LoginTokenFindFirstOrThrowSelectSchema: z.ZodType<Prisma.LoginTokenSelect> = z.object({
    id: z.boolean().optional(),
    token: z.boolean().optional(),
    identifier: z.boolean().optional(),
    password: z.boolean().optional(),
    userId: z.boolean().optional(),
    userType: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    expires: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.LoginTokenSelect>;

export const LoginTokenFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    token: z.boolean().optional(),
    identifier: z.boolean().optional(),
    password: z.boolean().optional(),
    userId: z.boolean().optional(),
    userType: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    expires: z.boolean().optional()
  }).strict();

export const LoginTokenFindFirstOrThrowSchema: z.ZodType<Prisma.LoginTokenFindFirstOrThrowArgs> = z.object({ select: LoginTokenFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([LoginTokenOrderByWithRelationInputObjectSchema, LoginTokenOrderByWithRelationInputObjectSchema.array()]).optional(), where: LoginTokenWhereInputObjectSchema.optional(), cursor: LoginTokenWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([LoginTokenScalarFieldEnumSchema, LoginTokenScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.LoginTokenFindFirstOrThrowArgs>;

export const LoginTokenFindFirstOrThrowZodSchema = z.object({ select: LoginTokenFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([LoginTokenOrderByWithRelationInputObjectSchema, LoginTokenOrderByWithRelationInputObjectSchema.array()]).optional(), where: LoginTokenWhereInputObjectSchema.optional(), cursor: LoginTokenWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([LoginTokenScalarFieldEnumSchema, LoginTokenScalarFieldEnumSchema.array()]).optional() }).strict();