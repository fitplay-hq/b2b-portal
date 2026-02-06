import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { AdminWhereInputObjectSchema as AdminWhereInputObjectSchema } from './objects/AdminWhereInput.schema';
import { AdminOrderByWithAggregationInputObjectSchema as AdminOrderByWithAggregationInputObjectSchema } from './objects/AdminOrderByWithAggregationInput.schema';
import { AdminScalarWhereWithAggregatesInputObjectSchema as AdminScalarWhereWithAggregatesInputObjectSchema } from './objects/AdminScalarWhereWithAggregatesInput.schema';
import { AdminScalarFieldEnumSchema } from './enums/AdminScalarFieldEnum.schema';
import { AdminCountAggregateInputObjectSchema as AdminCountAggregateInputObjectSchema } from './objects/AdminCountAggregateInput.schema';
import { AdminMinAggregateInputObjectSchema as AdminMinAggregateInputObjectSchema } from './objects/AdminMinAggregateInput.schema';
import { AdminMaxAggregateInputObjectSchema as AdminMaxAggregateInputObjectSchema } from './objects/AdminMaxAggregateInput.schema';

export const AdminGroupBySchema: z.ZodType<Prisma.AdminGroupByArgs> = z.object({ where: AdminWhereInputObjectSchema.optional(), orderBy: z.union([AdminOrderByWithAggregationInputObjectSchema, AdminOrderByWithAggregationInputObjectSchema.array()]).optional(), having: AdminScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(AdminScalarFieldEnumSchema), _count: z.union([ z.literal(true), AdminCountAggregateInputObjectSchema ]).optional(), _min: AdminMinAggregateInputObjectSchema.optional(), _max: AdminMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AdminGroupByArgs>;

export const AdminGroupByZodSchema = z.object({ where: AdminWhereInputObjectSchema.optional(), orderBy: z.union([AdminOrderByWithAggregationInputObjectSchema, AdminOrderByWithAggregationInputObjectSchema.array()]).optional(), having: AdminScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(AdminScalarFieldEnumSchema), _count: z.union([ z.literal(true), AdminCountAggregateInputObjectSchema ]).optional(), _min: AdminMinAggregateInputObjectSchema.optional(), _max: AdminMaxAggregateInputObjectSchema.optional() }).strict();