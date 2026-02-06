import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { CompanyWhereInputObjectSchema as CompanyWhereInputObjectSchema } from './objects/CompanyWhereInput.schema';
import { CompanyOrderByWithAggregationInputObjectSchema as CompanyOrderByWithAggregationInputObjectSchema } from './objects/CompanyOrderByWithAggregationInput.schema';
import { CompanyScalarWhereWithAggregatesInputObjectSchema as CompanyScalarWhereWithAggregatesInputObjectSchema } from './objects/CompanyScalarWhereWithAggregatesInput.schema';
import { CompanyScalarFieldEnumSchema } from './enums/CompanyScalarFieldEnum.schema';
import { CompanyCountAggregateInputObjectSchema as CompanyCountAggregateInputObjectSchema } from './objects/CompanyCountAggregateInput.schema';
import { CompanyMinAggregateInputObjectSchema as CompanyMinAggregateInputObjectSchema } from './objects/CompanyMinAggregateInput.schema';
import { CompanyMaxAggregateInputObjectSchema as CompanyMaxAggregateInputObjectSchema } from './objects/CompanyMaxAggregateInput.schema';

export const CompanyGroupBySchema: z.ZodType<Prisma.CompanyGroupByArgs> = z.object({ where: CompanyWhereInputObjectSchema.optional(), orderBy: z.union([CompanyOrderByWithAggregationInputObjectSchema, CompanyOrderByWithAggregationInputObjectSchema.array()]).optional(), having: CompanyScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(CompanyScalarFieldEnumSchema), _count: z.union([ z.literal(true), CompanyCountAggregateInputObjectSchema ]).optional(), _min: CompanyMinAggregateInputObjectSchema.optional(), _max: CompanyMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CompanyGroupByArgs>;

export const CompanyGroupByZodSchema = z.object({ where: CompanyWhereInputObjectSchema.optional(), orderBy: z.union([CompanyOrderByWithAggregationInputObjectSchema, CompanyOrderByWithAggregationInputObjectSchema.array()]).optional(), having: CompanyScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(CompanyScalarFieldEnumSchema), _count: z.union([ z.literal(true), CompanyCountAggregateInputObjectSchema ]).optional(), _min: CompanyMinAggregateInputObjectSchema.optional(), _max: CompanyMaxAggregateInputObjectSchema.optional() }).strict();