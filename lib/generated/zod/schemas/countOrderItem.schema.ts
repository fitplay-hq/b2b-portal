import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderItemOrderByWithRelationInputObjectSchema as OrderItemOrderByWithRelationInputObjectSchema } from './objects/OrderItemOrderByWithRelationInput.schema';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './objects/OrderItemWhereInput.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './objects/OrderItemWhereUniqueInput.schema';
import { OrderItemCountAggregateInputObjectSchema as OrderItemCountAggregateInputObjectSchema } from './objects/OrderItemCountAggregateInput.schema';

export const OrderItemCountSchema: z.ZodType<Prisma.OrderItemCountArgs> = z.object({ orderBy: z.union([OrderItemOrderByWithRelationInputObjectSchema, OrderItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: OrderItemWhereInputObjectSchema.optional(), cursor: OrderItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), OrderItemCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.OrderItemCountArgs>;

export const OrderItemCountZodSchema = z.object({ orderBy: z.union([OrderItemOrderByWithRelationInputObjectSchema, OrderItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: OrderItemWhereInputObjectSchema.optional(), cursor: OrderItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), OrderItemCountAggregateInputObjectSchema ]).optional() }).strict();