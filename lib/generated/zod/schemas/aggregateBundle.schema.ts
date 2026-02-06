import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleOrderByWithRelationInputObjectSchema as BundleOrderByWithRelationInputObjectSchema } from './objects/BundleOrderByWithRelationInput.schema';
import { BundleWhereInputObjectSchema as BundleWhereInputObjectSchema } from './objects/BundleWhereInput.schema';
import { BundleWhereUniqueInputObjectSchema as BundleWhereUniqueInputObjectSchema } from './objects/BundleWhereUniqueInput.schema';
import { BundleCountAggregateInputObjectSchema as BundleCountAggregateInputObjectSchema } from './objects/BundleCountAggregateInput.schema';
import { BundleMinAggregateInputObjectSchema as BundleMinAggregateInputObjectSchema } from './objects/BundleMinAggregateInput.schema';
import { BundleMaxAggregateInputObjectSchema as BundleMaxAggregateInputObjectSchema } from './objects/BundleMaxAggregateInput.schema';
import { BundleAvgAggregateInputObjectSchema as BundleAvgAggregateInputObjectSchema } from './objects/BundleAvgAggregateInput.schema';
import { BundleSumAggregateInputObjectSchema as BundleSumAggregateInputObjectSchema } from './objects/BundleSumAggregateInput.schema';

export const BundleAggregateSchema: z.ZodType<Prisma.BundleAggregateArgs> = z.object({ orderBy: z.union([BundleOrderByWithRelationInputObjectSchema, BundleOrderByWithRelationInputObjectSchema.array()]).optional(), where: BundleWhereInputObjectSchema.optional(), cursor: BundleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), BundleCountAggregateInputObjectSchema ]).optional(), _min: BundleMinAggregateInputObjectSchema.optional(), _max: BundleMaxAggregateInputObjectSchema.optional(), _avg: BundleAvgAggregateInputObjectSchema.optional(), _sum: BundleSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BundleAggregateArgs>;

export const BundleAggregateZodSchema = z.object({ orderBy: z.union([BundleOrderByWithRelationInputObjectSchema, BundleOrderByWithRelationInputObjectSchema.array()]).optional(), where: BundleWhereInputObjectSchema.optional(), cursor: BundleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), BundleCountAggregateInputObjectSchema ]).optional(), _min: BundleMinAggregateInputObjectSchema.optional(), _max: BundleMaxAggregateInputObjectSchema.optional(), _avg: BundleAvgAggregateInputObjectSchema.optional(), _sum: BundleSumAggregateInputObjectSchema.optional() }).strict();