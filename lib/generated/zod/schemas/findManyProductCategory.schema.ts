import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ProductCategoryIncludeObjectSchema as ProductCategoryIncludeObjectSchema } from './objects/ProductCategoryInclude.schema';
import { ProductCategoryOrderByWithRelationInputObjectSchema as ProductCategoryOrderByWithRelationInputObjectSchema } from './objects/ProductCategoryOrderByWithRelationInput.schema';
import { ProductCategoryWhereInputObjectSchema as ProductCategoryWhereInputObjectSchema } from './objects/ProductCategoryWhereInput.schema';
import { ProductCategoryWhereUniqueInputObjectSchema as ProductCategoryWhereUniqueInputObjectSchema } from './objects/ProductCategoryWhereUniqueInput.schema';
import { ProductCategoryScalarFieldEnumSchema } from './enums/ProductCategoryScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ProductCategoryFindManySelectSchema: z.ZodType<Prisma.ProductCategorySelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    displayName: z.boolean().optional(),
    description: z.boolean().optional(),
    shortCode: z.boolean().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    products: z.boolean().optional(),
    subCategories: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ProductCategorySelect>;

export const ProductCategoryFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    displayName: z.boolean().optional(),
    description: z.boolean().optional(),
    shortCode: z.boolean().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    products: z.boolean().optional(),
    subCategories: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const ProductCategoryFindManySchema: z.ZodType<Prisma.ProductCategoryFindManyArgs> = z.object({ select: ProductCategoryFindManySelectSchema.optional(), include: z.lazy(() => ProductCategoryIncludeObjectSchema.optional()), orderBy: z.union([ProductCategoryOrderByWithRelationInputObjectSchema, ProductCategoryOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductCategoryWhereInputObjectSchema.optional(), cursor: ProductCategoryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ProductCategoryScalarFieldEnumSchema, ProductCategoryScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ProductCategoryFindManyArgs>;

export const ProductCategoryFindManyZodSchema = z.object({ select: ProductCategoryFindManySelectSchema.optional(), include: z.lazy(() => ProductCategoryIncludeObjectSchema.optional()), orderBy: z.union([ProductCategoryOrderByWithRelationInputObjectSchema, ProductCategoryOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductCategoryWhereInputObjectSchema.optional(), cursor: ProductCategoryWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ProductCategoryScalarFieldEnumSchema, ProductCategoryScalarFieldEnumSchema.array()]).optional() }).strict();