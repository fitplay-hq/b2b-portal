import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ProductCategoryOrderByWithRelationInputObjectSchema as ProductCategoryOrderByWithRelationInputObjectSchema } from './ProductCategoryOrderByWithRelationInput.schema';
import { SubCategoryOrderByWithRelationInputObjectSchema as SubCategoryOrderByWithRelationInputObjectSchema } from './SubCategoryOrderByWithRelationInput.schema';
import { CompanyOrderByRelationAggregateInputObjectSchema as CompanyOrderByRelationAggregateInputObjectSchema } from './CompanyOrderByRelationAggregateInput.schema';
import { ClientProductOrderByRelationAggregateInputObjectSchema as ClientProductOrderByRelationAggregateInputObjectSchema } from './ClientProductOrderByRelationAggregateInput.schema';
import { OrderItemOrderByRelationAggregateInputObjectSchema as OrderItemOrderByRelationAggregateInputObjectSchema } from './OrderItemOrderByRelationAggregateInput.schema';
import { BundleOrderItemOrderByRelationAggregateInputObjectSchema as BundleOrderItemOrderByRelationAggregateInputObjectSchema } from './BundleOrderItemOrderByRelationAggregateInput.schema';
import { BundleItemOrderByRelationAggregateInputObjectSchema as BundleItemOrderByRelationAggregateInputObjectSchema } from './BundleItemOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  images: SortOrderSchema.optional(),
  price: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sku: SortOrderSchema.optional(),
  availableStock: SortOrderSchema.optional(),
  minStockThreshold: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  inventoryUpdateReason: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  inventoryLogs: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  categories: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  categoryId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  subCategoryId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  avgRating: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  noOfReviews: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  brand: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  category: z.lazy(() => ProductCategoryOrderByWithRelationInputObjectSchema).optional(),
  subCategory: z.lazy(() => SubCategoryOrderByWithRelationInputObjectSchema).optional(),
  companies: z.lazy(() => CompanyOrderByRelationAggregateInputObjectSchema).optional(),
  clients: z.lazy(() => ClientProductOrderByRelationAggregateInputObjectSchema).optional(),
  orderItems: z.lazy(() => OrderItemOrderByRelationAggregateInputObjectSchema).optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemOrderByRelationAggregateInputObjectSchema).optional(),
  bundleItems: z.lazy(() => BundleItemOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const ProductOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ProductOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductOrderByWithRelationInput>;
export const ProductOrderByWithRelationInputObjectZodSchema = makeSchema();
