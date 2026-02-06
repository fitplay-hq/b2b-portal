import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ResetTokenOrderByWithRelationInputObjectSchema as ResetTokenOrderByWithRelationInputObjectSchema } from './objects/ResetTokenOrderByWithRelationInput.schema';
import { ResetTokenWhereInputObjectSchema as ResetTokenWhereInputObjectSchema } from './objects/ResetTokenWhereInput.schema';
import { ResetTokenWhereUniqueInputObjectSchema as ResetTokenWhereUniqueInputObjectSchema } from './objects/ResetTokenWhereUniqueInput.schema';
import { ResetTokenScalarFieldEnumSchema } from './enums/ResetTokenScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ResetTokenFindManySelectSchema: z.ZodType<Prisma.ResetTokenSelect> = z.object({
    id: z.boolean().optional(),
    identifier: z.boolean().optional(),
    password: z.boolean().optional(),
    token: z.boolean().optional(),
    userId: z.boolean().optional(),
    userType: z.boolean().optional(),
    expires: z.boolean().optional(),
    createdAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ResetTokenSelect>;

export const ResetTokenFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    identifier: z.boolean().optional(),
    password: z.boolean().optional(),
    token: z.boolean().optional(),
    userId: z.boolean().optional(),
    userType: z.boolean().optional(),
    expires: z.boolean().optional(),
    createdAt: z.boolean().optional()
  }).strict();

export const ResetTokenFindManySchema: z.ZodType<Prisma.ResetTokenFindManyArgs> = z.object({ select: ResetTokenFindManySelectSchema.optional(),  orderBy: z.union([ResetTokenOrderByWithRelationInputObjectSchema, ResetTokenOrderByWithRelationInputObjectSchema.array()]).optional(), where: ResetTokenWhereInputObjectSchema.optional(), cursor: ResetTokenWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ResetTokenScalarFieldEnumSchema, ResetTokenScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ResetTokenFindManyArgs>;

export const ResetTokenFindManyZodSchema = z.object({ select: ResetTokenFindManySelectSchema.optional(),  orderBy: z.union([ResetTokenOrderByWithRelationInputObjectSchema, ResetTokenOrderByWithRelationInputObjectSchema.array()]).optional(), where: ResetTokenWhereInputObjectSchema.optional(), cursor: ResetTokenWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ResetTokenScalarFieldEnumSchema, ResetTokenScalarFieldEnumSchema.array()]).optional() }).strict();