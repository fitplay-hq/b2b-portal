import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleIncludeObjectSchema as BundleIncludeObjectSchema } from './objects/BundleInclude.schema';
import { BundleOrderByWithRelationInputObjectSchema as BundleOrderByWithRelationInputObjectSchema } from './objects/BundleOrderByWithRelationInput.schema';
import { BundleWhereInputObjectSchema as BundleWhereInputObjectSchema } from './objects/BundleWhereInput.schema';
import { BundleWhereUniqueInputObjectSchema as BundleWhereUniqueInputObjectSchema } from './objects/BundleWhereUniqueInput.schema';
import { BundleScalarFieldEnumSchema } from './enums/BundleScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const BundleFindFirstSelectSchema: z.ZodType<Prisma.BundleSelect> = z.object({
    id: z.boolean().optional(),
    orderId: z.boolean().optional(),
    order: z.boolean().optional(),
    price: z.boolean().optional(),
    numberOfBundles: z.boolean().optional(),
    items: z.boolean().optional(),
    bundleOrderItems: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.BundleSelect>;

export const BundleFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    orderId: z.boolean().optional(),
    order: z.boolean().optional(),
    price: z.boolean().optional(),
    numberOfBundles: z.boolean().optional(),
    items: z.boolean().optional(),
    bundleOrderItems: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const BundleFindFirstSchema: z.ZodType<Prisma.BundleFindFirstArgs> = z.object({ select: BundleFindFirstSelectSchema.optional(), include: z.lazy(() => BundleIncludeObjectSchema.optional()), orderBy: z.union([BundleOrderByWithRelationInputObjectSchema, BundleOrderByWithRelationInputObjectSchema.array()]).optional(), where: BundleWhereInputObjectSchema.optional(), cursor: BundleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([BundleScalarFieldEnumSchema, BundleScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.BundleFindFirstArgs>;

export const BundleFindFirstZodSchema = z.object({ select: BundleFindFirstSelectSchema.optional(), include: z.lazy(() => BundleIncludeObjectSchema.optional()), orderBy: z.union([BundleOrderByWithRelationInputObjectSchema, BundleOrderByWithRelationInputObjectSchema.array()]).optional(), where: BundleWhereInputObjectSchema.optional(), cursor: BundleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([BundleScalarFieldEnumSchema, BundleScalarFieldEnumSchema.array()]).optional() }).strict();