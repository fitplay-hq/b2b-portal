import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { AdminOrderByWithRelationInputObjectSchema as AdminOrderByWithRelationInputObjectSchema } from './objects/AdminOrderByWithRelationInput.schema';
import { AdminWhereInputObjectSchema as AdminWhereInputObjectSchema } from './objects/AdminWhereInput.schema';
import { AdminWhereUniqueInputObjectSchema as AdminWhereUniqueInputObjectSchema } from './objects/AdminWhereUniqueInput.schema';
import { AdminCountAggregateInputObjectSchema as AdminCountAggregateInputObjectSchema } from './objects/AdminCountAggregateInput.schema';
import { AdminMinAggregateInputObjectSchema as AdminMinAggregateInputObjectSchema } from './objects/AdminMinAggregateInput.schema';
import { AdminMaxAggregateInputObjectSchema as AdminMaxAggregateInputObjectSchema } from './objects/AdminMaxAggregateInput.schema';

export const AdminAggregateSchema: z.ZodType<Prisma.AdminAggregateArgs> = z.object({ orderBy: z.union([AdminOrderByWithRelationInputObjectSchema, AdminOrderByWithRelationInputObjectSchema.array()]).optional(), where: AdminWhereInputObjectSchema.optional(), cursor: AdminWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), AdminCountAggregateInputObjectSchema ]).optional(), _min: AdminMinAggregateInputObjectSchema.optional(), _max: AdminMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AdminAggregateArgs>;

export const AdminAggregateZodSchema = z.object({ orderBy: z.union([AdminOrderByWithRelationInputObjectSchema, AdminOrderByWithRelationInputObjectSchema.array()]).optional(), where: AdminWhereInputObjectSchema.optional(), cursor: AdminWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), AdminCountAggregateInputObjectSchema ]).optional(), _min: AdminMinAggregateInputObjectSchema.optional(), _max: AdminMaxAggregateInputObjectSchema.optional() }).strict();