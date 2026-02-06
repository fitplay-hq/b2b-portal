import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleItemIncludeObjectSchema as BundleItemIncludeObjectSchema } from './objects/BundleItemInclude.schema';
import { BundleItemOrderByWithRelationInputObjectSchema as BundleItemOrderByWithRelationInputObjectSchema } from './objects/BundleItemOrderByWithRelationInput.schema';
import { BundleItemWhereInputObjectSchema as BundleItemWhereInputObjectSchema } from './objects/BundleItemWhereInput.schema';
import { BundleItemWhereUniqueInputObjectSchema as BundleItemWhereUniqueInputObjectSchema } from './objects/BundleItemWhereUniqueInput.schema';
import { BundleItemScalarFieldEnumSchema } from './enums/BundleItemScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const BundleItemFindFirstOrThrowSelectSchema: z.ZodType<Prisma.BundleItemSelect> = z.object({
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

export const BundleItemFindFirstOrThrowSelectZodSchema = z.object({
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

export const BundleItemFindFirstOrThrowSchema: z.ZodType<Prisma.BundleItemFindFirstOrThrowArgs> = z.object({ select: BundleItemFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => BundleItemIncludeObjectSchema.optional()), orderBy: z.union([BundleItemOrderByWithRelationInputObjectSchema, BundleItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: BundleItemWhereInputObjectSchema.optional(), cursor: BundleItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([BundleItemScalarFieldEnumSchema, BundleItemScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.BundleItemFindFirstOrThrowArgs>;

export const BundleItemFindFirstOrThrowZodSchema = z.object({ select: BundleItemFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => BundleItemIncludeObjectSchema.optional()), orderBy: z.union([BundleItemOrderByWithRelationInputObjectSchema, BundleItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: BundleItemWhereInputObjectSchema.optional(), cursor: BundleItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([BundleItemScalarFieldEnumSchema, BundleItemScalarFieldEnumSchema.array()]).optional() }).strict();