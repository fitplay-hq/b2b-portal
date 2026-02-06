import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ProductOrderByRelationAggregateInputObjectSchema as ProductOrderByRelationAggregateInputObjectSchema } from './ProductOrderByRelationAggregateInput.schema';
import { SubCategoryOrderByRelationAggregateInputObjectSchema as SubCategoryOrderByRelationAggregateInputObjectSchema } from './SubCategoryOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  displayName: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  shortCode: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  products: z.lazy(() => ProductOrderByRelationAggregateInputObjectSchema).optional(),
  subCategories: z.lazy(() => SubCategoryOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const ProductCategoryOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ProductCategoryOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryOrderByWithRelationInput>;
export const ProductCategoryOrderByWithRelationInputObjectZodSchema = makeSchema();
