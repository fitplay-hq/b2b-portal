import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { CompanyIncludeObjectSchema as CompanyIncludeObjectSchema } from './objects/CompanyInclude.schema';
import { CompanyOrderByWithRelationInputObjectSchema as CompanyOrderByWithRelationInputObjectSchema } from './objects/CompanyOrderByWithRelationInput.schema';
import { CompanyWhereInputObjectSchema as CompanyWhereInputObjectSchema } from './objects/CompanyWhereInput.schema';
import { CompanyWhereUniqueInputObjectSchema as CompanyWhereUniqueInputObjectSchema } from './objects/CompanyWhereUniqueInput.schema';
import { CompanyScalarFieldEnumSchema } from './enums/CompanyScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const CompanyFindFirstOrThrowSelectSchema: z.ZodType<Prisma.CompanySelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    address: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    products: z.boolean().optional(),
    clients: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.CompanySelect>;

export const CompanyFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    address: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    products: z.boolean().optional(),
    clients: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const CompanyFindFirstOrThrowSchema: z.ZodType<Prisma.CompanyFindFirstOrThrowArgs> = z.object({ select: CompanyFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => CompanyIncludeObjectSchema.optional()), orderBy: z.union([CompanyOrderByWithRelationInputObjectSchema, CompanyOrderByWithRelationInputObjectSchema.array()]).optional(), where: CompanyWhereInputObjectSchema.optional(), cursor: CompanyWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CompanyScalarFieldEnumSchema, CompanyScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.CompanyFindFirstOrThrowArgs>;

export const CompanyFindFirstOrThrowZodSchema = z.object({ select: CompanyFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => CompanyIncludeObjectSchema.optional()), orderBy: z.union([CompanyOrderByWithRelationInputObjectSchema, CompanyOrderByWithRelationInputObjectSchema.array()]).optional(), where: CompanyWhereInputObjectSchema.optional(), cursor: CompanyWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CompanyScalarFieldEnumSchema, CompanyScalarFieldEnumSchema.array()]).optional() }).strict();