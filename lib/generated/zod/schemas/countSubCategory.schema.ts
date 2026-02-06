import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SubCategoryOrderByWithRelationInputObjectSchema as SubCategoryOrderByWithRelationInputObjectSchema } from './objects/SubCategoryOrderByWithRelationInput.schema';
import { SubCategoryWhereInputObjectSchema as SubCategoryWhereInputObjectSchema } from './objects/SubCategoryWhereInput.schema';
import { SubCategoryWhereUniqueInputObjectSchema as SubCategoryWhereUniqueInputObjectSchema } from './objects/SubCategoryWhereUniqueInput.schema';
import { SubCategoryCountAggregateInputObjectSchema as SubCategoryCountAggregateInputObjectSchema } from './objects/SubCategoryCountAggregateInput.schema';

export const SubCategoryCountSchema: z.ZodType<Prisma.SubCategoryCountArgs> = z.object({ orderBy: z.union([SubCategoryOrderByWithRelationInputObjectSchema, SubCategoryOrderByWithRelationInputObjectSchema.array()]).optional(), where: SubCategoryWhereInputObjectSchema.optional(), cursor: SubCategoryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), SubCategoryCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.SubCategoryCountArgs>;

export const SubCategoryCountZodSchema = z.object({ orderBy: z.union([SubCategoryOrderByWithRelationInputObjectSchema, SubCategoryOrderByWithRelationInputObjectSchema.array()]).optional(), where: SubCategoryWhereInputObjectSchema.optional(), cursor: SubCategoryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), SubCategoryCountAggregateInputObjectSchema ]).optional() }).strict();