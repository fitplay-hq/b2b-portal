import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderItemIncludeObjectSchema as OrderItemIncludeObjectSchema } from './objects/OrderItemInclude.schema';
import { OrderItemOrderByWithRelationInputObjectSchema as OrderItemOrderByWithRelationInputObjectSchema } from './objects/OrderItemOrderByWithRelationInput.schema';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './objects/OrderItemWhereInput.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './objects/OrderItemWhereUniqueInput.schema';
import { OrderItemScalarFieldEnumSchema } from './enums/OrderItemScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const OrderItemFindFirstOrThrowSelectSchema: z.ZodType<Prisma.OrderItemSelect> = z.object({
    id: z.boolean().optional(),
    order: z.boolean().optional(),
    orderId: z.boolean().optional(),
    product: z.boolean().optional(),
    productId: z.boolean().optional(),
    quantity: z.boolean().optional(),
    price: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.OrderItemSelect>;

export const OrderItemFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    order: z.boolean().optional(),
    orderId: z.boolean().optional(),
    product: z.boolean().optional(),
    productId: z.boolean().optional(),
    quantity: z.boolean().optional(),
    price: z.boolean().optional()
  }).strict();

export const OrderItemFindFirstOrThrowSchema: z.ZodType<Prisma.OrderItemFindFirstOrThrowArgs> = z.object({ select: OrderItemFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => OrderItemIncludeObjectSchema.optional()), orderBy: z.union([OrderItemOrderByWithRelationInputObjectSchema, OrderItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: OrderItemWhereInputObjectSchema.optional(), cursor: OrderItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([OrderItemScalarFieldEnumSchema, OrderItemScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.OrderItemFindFirstOrThrowArgs>;

export const OrderItemFindFirstOrThrowZodSchema = z.object({ select: OrderItemFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => OrderItemIncludeObjectSchema.optional()), orderBy: z.union([OrderItemOrderByWithRelationInputObjectSchema, OrderItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: OrderItemWhereInputObjectSchema.optional(), cursor: OrderItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([OrderItemScalarFieldEnumSchema, OrderItemScalarFieldEnumSchema.array()]).optional() }).strict();