import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { ProductCategoryOrderByWithRelationInputObjectSchema as ProductCategoryOrderByWithRelationInputObjectSchema } from './ProductCategoryOrderByWithRelationInput.schema';
import { ProductOrderByRelationAggregateInputObjectSchema as ProductOrderByRelationAggregateInputObjectSchema } from './ProductOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  categoryId: SortOrderSchema.optional(),
  shortCode: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  category: z.lazy(() => ProductCategoryOrderByWithRelationInputObjectSchema).optional(),
  products: z.lazy(() => ProductOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const SubCategoryOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.SubCategoryOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryOrderByWithRelationInput>;
export const SubCategoryOrderByWithRelationInputObjectZodSchema = makeSchema();
