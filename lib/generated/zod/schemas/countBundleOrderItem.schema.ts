import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleOrderItemOrderByWithRelationInputObjectSchema as BundleOrderItemOrderByWithRelationInputObjectSchema } from './objects/BundleOrderItemOrderByWithRelationInput.schema';
import { BundleOrderItemWhereInputObjectSchema as BundleOrderItemWhereInputObjectSchema } from './objects/BundleOrderItemWhereInput.schema';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './objects/BundleOrderItemWhereUniqueInput.schema';
import { BundleOrderItemCountAggregateInputObjectSchema as BundleOrderItemCountAggregateInputObjectSchema } from './objects/BundleOrderItemCountAggregateInput.schema';

export const BundleOrderItemCountSchema: z.ZodType<Prisma.BundleOrderItemCountArgs> = z.object({ orderBy: z.union([BundleOrderItemOrderByWithRelationInputObjectSchema, BundleOrderItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: BundleOrderItemWhereInputObjectSchema.optional(), cursor: BundleOrderItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), BundleOrderItemCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.BundleOrderItemCountArgs>;

export const BundleOrderItemCountZodSchema = z.object({ orderBy: z.union([BundleOrderItemOrderByWithRelationInputObjectSchema, BundleOrderItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: BundleOrderItemWhereInputObjectSchema.optional(), cursor: BundleOrderItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), BundleOrderItemCountAggregateInputObjectSchema ]).optional() }).strict();