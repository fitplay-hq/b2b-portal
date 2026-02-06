import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ProductCategorySelectObjectSchema as ProductCategorySelectObjectSchema } from './objects/ProductCategorySelect.schema';
import { ProductCategoryIncludeObjectSchema as ProductCategoryIncludeObjectSchema } from './objects/ProductCategoryInclude.schema';
import { ProductCategoryWhereUniqueInputObjectSchema as ProductCategoryWhereUniqueInputObjectSchema } from './objects/ProductCategoryWhereUniqueInput.schema';

export const ProductCategoryFindUniqueSchema: z.ZodType<Prisma.ProductCategoryFindUniqueArgs> = z.object({ select: ProductCategorySelectObjectSchema.optional(), include: ProductCategoryIncludeObjectSchema.optional(), where: ProductCategoryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ProductCategoryFindUniqueArgs>;

export const ProductCategoryFindUniqueZodSchema = z.object({ select: ProductCategorySelectObjectSchema.optional(), include: ProductCategoryIncludeObjectSchema.optional(), where: ProductCategoryWhereUniqueInputObjectSchema }).strict();