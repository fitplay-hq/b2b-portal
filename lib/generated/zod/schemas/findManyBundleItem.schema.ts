import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleItemIncludeObjectSchema as BundleItemIncludeObjectSchema } from './objects/BundleItemInclude.schema';
import { BundleItemOrderByWithRelationInputObjectSchema as BundleItemOrderByWithRelationInputObjectSchema } from './objects/BundleItemOrderByWithRelationInput.schema';
import { BundleItemWhereInputObjectSchema as BundleItemWhereInputObjectSchema } from './objects/BundleItemWhereInput.schema';
import { BundleItemWhereUniqueInputObjectSchema as BundleItemWhereUniqueInputObjectSchema } from './objects/BundleItemWhereUniqueInput.schema';
import { BundleItemScalarFieldEnumSchema } from './enums/BundleItemScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const BundleItemFindManySelectSchema: z.ZodType<Prisma.BundleItemSelect> = z.object({
    id: z.boolean().optional(),
    bundleId: z.boolean().optional(),
    bundle: z.boolean().optional(),
    product: z.boolean().optional(),
    productId: z.boolean().optional(),
    bundleProductQuantity: z.boolean().optional(),
    price: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    bundleOrderItems: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.BundleItemSelect>;

export const BundleItemFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    bundleId: z.boolean().optional(),
    bundle: z.boolean().optional(),
    product: z.boolean().optional(),
    productId: z.boolean().optional(),
    bundleProductQuantity: z.boolean().optional(),
    price: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    bundleOrderItems: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const BundleItemFindManySchema: z.ZodType<Prisma.BundleItemFindManyArgs> = z.object({ select: BundleItemFindManySelectSchema.optional(), include: z.lazy(() => BundleItemIncludeObjectSchema.optional()), orderBy: z.union([BundleItemOrderByWithRelationInputObjectSchema, BundleItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: BundleItemWhereInputObjectSchema.optional(), cursor: BundleItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([BundleItemScalarFieldEnumSchema, BundleItemScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.BundleItemFindManyArgs>;

export const BundleItemFindManyZodSchema = z.object({ select: BundleItemFindManySelectSchema.optional(), include: z.lazy(() => BundleItemIncludeObjectSchema.optional()), orderBy: z.union([BundleItemOrderByWithRelationInputObjectSchema, BundleItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: BundleItemWhereInputObjectSchema.optional(), cursor: BundleItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([BundleItemScalarFieldEnumSchema, BundleItemScalarFieldEnumSchema.array()]).optional() }).strict();