import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { AdminOrderByWithRelationInputObjectSchema as AdminOrderByWithRelationInputObjectSchema } from './objects/AdminOrderByWithRelationInput.schema';
import { AdminWhereInputObjectSchema as AdminWhereInputObjectSchema } from './objects/AdminWhereInput.schema';
import { AdminWhereUniqueInputObjectSchema as AdminWhereUniqueInputObjectSchema } from './objects/AdminWhereUniqueInput.schema';
import { AdminCountAggregateInputObjectSchema as AdminCountAggregateInputObjectSchema } from './objects/AdminCountAggregateInput.schema';

export const AdminCountSchema: z.ZodType<Prisma.AdminCountArgs> = z.object({ orderBy: z.union([AdminOrderByWithRelationInputObjectSchema, AdminOrderByWithRelationInputObjectSchema.array()]).optional(), where: AdminWhereInputObjectSchema.optional(), cursor: AdminWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AdminCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.AdminCountArgs>;

export const AdminCountZodSchema = z.object({ orderBy: z.union([AdminOrderByWithRelationInputObjectSchema, AdminOrderByWithRelationInputObjectSchema.array()]).optional(), where: AdminWhereInputObjectSchema.optional(), cursor: AdminWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), AdminCountAggregateInputObjectSchema ]).optional() }).strict();