import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleOrderItemIncludeObjectSchema as BundleOrderItemIncludeObjectSchema } from './objects/BundleOrderItemInclude.schema';
import { BundleOrderItemOrderByWithRelationInputObjectSchema as BundleOrderItemOrderByWithRelationInputObjectSchema } from './objects/BundleOrderItemOrderByWithRelationInput.schema';
import { BundleOrderItemWhereInputObjectSchema as BundleOrderItemWhereInputObjectSchema } from './objects/BundleOrderItemWhereInput.schema';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './objects/BundleOrderItemWhereUniqueInput.schema';
import { BundleOrderItemScalarFieldEnumSchema } from './enums/BundleOrderItemScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const BundleOrderItemFindFirstOrThrowSelectSchema: z.ZodType<Prisma.BundleOrderItemSelect> = z.object({
    id: z.boolean().optional(),
    bundleId: z.boolean().optional(),
    bundle: z.boolean().optional(),
    order: z.boolean().optional(),
    orderId: z.boolean().optional(),
    product: z.boolean().optional(),
    productId: z.boolean().optional(),
    quantity: z.boolean().optional(),
    price: z.boolean().optional(),
    bundleItems: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.BundleOrderItemSelect>;

export const BundleOrderItemFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    bundleId: z.boolean().optional(),
    bundle: z.boolean().optional(),
    order: z.boolean().optional(),
    orderId: z.boolean().optional(),
    product: z.boolean().optional(),
    productId: z.boolean().optional(),
    quantity: z.boolean().optional(),
    price: z.boolean().optional(),
    bundleItems: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const BundleOrderItemFindFirstOrThrowSchema: z.ZodType<Prisma.BundleOrderItemFindFirstOrThrowArgs> = z.object({ select: BundleOrderItemFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => BundleOrderItemIncludeObjectSchema.optional()), orderBy: z.union([BundleOrderItemOrderByWithRelationInputObjectSchema, BundleOrderItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: BundleOrderItemWhereInputObjectSchema.optional(), cursor: BundleOrderItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([BundleOrderItemScalarFieldEnumSchema, BundleOrderItemScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.BundleOrderItemFindFirstOrThrowArgs>;

export const BundleOrderItemFindFirstOrThrowZodSchema = z.object({ select: BundleOrderItemFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => BundleOrderItemIncludeObjectSchema.optional()), orderBy: z.union([BundleOrderItemOrderByWithRelationInputObjectSchema, BundleOrderItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: BundleOrderItemWhereInputObjectSchema.optional(), cursor: BundleOrderItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([BundleOrderItemScalarFieldEnumSchema, BundleOrderItemScalarFieldEnumSchema.array()]).optional() }).strict();