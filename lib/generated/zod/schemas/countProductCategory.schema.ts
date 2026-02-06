import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ProductCategoryOrderByWithRelationInputObjectSchema as ProductCategoryOrderByWithRelationInputObjectSchema } from './objects/ProductCategoryOrderByWithRelationInput.schema';
import { ProductCategoryWhereInputObjectSchema as ProductCategoryWhereInputObjectSchema } from './objects/ProductCategoryWhereInput.schema';
import { ProductCategoryWhereUniqueInputObjectSchema as ProductCategoryWhereUniqueInputObjectSchema } from './objects/ProductCategoryWhereUniqueInput.schema';
import { ProductCategoryCountAggregateInputObjectSchema as ProductCategoryCountAggregateInputObjectSchema } from './objects/ProductCategoryCountAggregateInput.schema';

export const ProductCategoryCountSchema: z.ZodType<Prisma.ProductCategoryCountArgs> = z.object({ orderBy: z.union([ProductCategoryOrderByWithRelationInputObjectSchema, ProductCategoryOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductCategoryWhereInputObjectSchema.optional(), cursor: ProductCategoryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ProductCategoryCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.ProductCategoryCountArgs>;

export const ProductCategoryCountZodSchema = z.object({ orderBy: z.union([ProductCategoryOrderByWithRelationInputObjectSchema, ProductCategoryOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductCategoryWhereInputObjectSchema.optional(), cursor: ProductCategoryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ProductCategoryCountAggregateInputObjectSchema ]).optional() }).strict();