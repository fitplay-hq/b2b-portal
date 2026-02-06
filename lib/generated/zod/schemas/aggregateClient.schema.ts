import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ClientOrderByWithRelationInputObjectSchema as ClientOrderByWithRelationInputObjectSchema } from './objects/ClientOrderByWithRelationInput.schema';
import { ClientWhereInputObjectSchema as ClientWhereInputObjectSchema } from './objects/ClientWhereInput.schema';
import { ClientWhereUniqueInputObjectSchema as ClientWhereUniqueInputObjectSchema } from './objects/ClientWhereUniqueInput.schema';
import { ClientCountAggregateInputObjectSchema as ClientCountAggregateInputObjectSchema } from './objects/ClientCountAggregateInput.schema';
import { ClientMinAggregateInputObjectSchema as ClientMinAggregateInputObjectSchema } from './objects/ClientMinAggregateInput.schema';
import { ClientMaxAggregateInputObjectSchema as ClientMaxAggregateInputObjectSchema } from './objects/ClientMaxAggregateInput.schema';

export const ClientAggregateSchema: z.ZodType<Prisma.ClientAggregateArgs> = z.object({ orderBy: z.union([ClientOrderByWithRelationInputObjectSchema, ClientOrderByWithRelationInputObjectSchema.array()]).optional(), where: ClientWhereInputObjectSchema.optional(), cursor: ClientWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), ClientCountAggregateInputObjectSchema ]).optional(), _min: ClientMinAggregateInputObjectSchema.optional(), _max: ClientMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ClientAggregateArgs>;

export const ClientAggregateZodSchema = z.object({ orderBy: z.union([ClientOrderByWithRelationInputObjectSchema, ClientOrderByWithRelationInputObjectSchema.array()]).optional(), where: ClientWhereInputObjectSchema.optional(), cursor: ClientWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), ClientCountAggregateInputObjectSchema ]).optional(), _min: ClientMinAggregateInputObjectSchema.optional(), _max: ClientMaxAggregateInputObjectSchema.optional() }).strict();