import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SubCategoryIncludeObjectSchema as SubCategoryIncludeObjectSchema } from './objects/SubCategoryInclude.schema';
import { SubCategoryOrderByWithRelationInputObjectSchema as SubCategoryOrderByWithRelationInputObjectSchema } from './objects/SubCategoryOrderByWithRelationInput.schema';
import { SubCategoryWhereInputObjectSchema as SubCategoryWhereInputObjectSchema } from './objects/SubCategoryWhereInput.schema';
import { SubCategoryWhereUniqueInputObjectSchema as SubCategoryWhereUniqueInputObjectSchema } from './objects/SubCategoryWhereUniqueInput.schema';
import { SubCategoryScalarFieldEnumSchema } from './enums/SubCategoryScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const SubCategoryFindFirstSelectSchema: z.ZodType<Prisma.SubCategorySelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    categoryId: z.boolean().optional(),
    shortCode: z.boolean().optional(),
    category: z.boolean().optional(),
    products: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.SubCategorySelect>;

export const SubCategoryFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    categoryId: z.boolean().optional(),
    shortCode: z.boolean().optional(),
    category: z.boolean().optional(),
    products: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const SubCategoryFindFirstSchema: z.ZodType<Prisma.SubCategoryFindFirstArgs> = z.object({ select: SubCategoryFindFirstSelectSchema.optional(), include: z.lazy(() => SubCategoryIncludeObjectSchema.optional()), orderBy: z.union([SubCategoryOrderByWithRelationInputObjectSchema, SubCategoryOrderByWithRelationInputObjectSchema.array()]).optional(), where: SubCategoryWhereInputObjectSchema.optional(), cursor: SubCategoryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SubCategoryScalarFieldEnumSchema, SubCategoryScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.SubCategoryFindFirstArgs>;

export const SubCategoryFindFirstZodSchema = z.object({ select: SubCategoryFindFirstSelectSchema.optional(), include: z.lazy(() => SubCategoryIncludeObjectSchema.optional()), orderBy: z.union([SubCategoryOrderByWithRelationInputObjectSchema, SubCategoryOrderByWithRelationInputObjectSchema.array()]).optional(), where: SubCategoryWhereInputObjectSchema.optional(), cursor: SubCategoryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SubCategoryScalarFieldEnumSchema, SubCategoryScalarFieldEnumSchema.array()]).optional() }).strict();