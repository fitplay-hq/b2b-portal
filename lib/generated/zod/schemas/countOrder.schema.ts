import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderOrderByWithRelationInputObjectSchema as OrderOrderByWithRelationInputObjectSchema } from './objects/OrderOrderByWithRelationInput.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './objects/OrderWhereInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './objects/OrderWhereUniqueInput.schema';
import { OrderCountAggregateInputObjectSchema as OrderCountAggregateInputObjectSchema } from './objects/OrderCountAggregateInput.schema';

export const OrderCountSchema: z.ZodType<Prisma.OrderCountArgs> = z.object({ orderBy: z.union([OrderOrderByWithRelationInputObjectSchema, OrderOrderByWithRelationInputObjectSchema.array()]).optional(), where: OrderWhereInputObjectSchema.optional(), cursor: OrderWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), OrderCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.OrderCountArgs>;

export const OrderCountZodSchema = z.object({ orderBy: z.union([OrderOrderByWithRelationInputObjectSchema, OrderOrderByWithRelationInputObjectSchema.array()]).optional(), where: OrderWhereInputObjectSchema.optional(), cursor: OrderWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), OrderCountAggregateInputObjectSchema ]).optional() }).strict();