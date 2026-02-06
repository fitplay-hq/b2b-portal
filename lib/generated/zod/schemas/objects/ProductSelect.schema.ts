import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCategoryArgsObjectSchema as ProductCategoryArgsObjectSchema } from './ProductCategoryArgs.schema';
import { SubCategoryArgsObjectSchema as SubCategoryArgsObjectSchema } from './SubCategoryArgs.schema';
import { CompanyFindManySchema as CompanyFindManySchema } from '../findManyCompany.schema';
import { ClientProductFindManySchema as ClientProductFindManySchema } from '../findManyClientProduct.schema';
import { OrderItemFindManySchema as OrderItemFindManySchema } from '../findManyOrderItem.schema';
import { BundleOrderItemFindManySchema as BundleOrderItemFindManySchema } from '../findManyBundleOrderItem.schema';
import { BundleItemFindManySchema as BundleItemFindManySchema } from '../findManyBundleItem.schema';
import { ProductCountOutputTypeArgsObjectSchema as ProductCountOutputTypeArgsObjectSchema } from './ProductCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  images: z.boolean().optional(),
  price: z.boolean().optional(),
  sku: z.boolean().optional(),
  availableStock: z.boolean().optional(),
  minStockThreshold: z.boolean().optional(),
  inventoryUpdateReason: z.boolean().optional(),
  inventoryLogs: z.boolean().optional(),
  description: z.boolean().optional(),
  categories: z.boolean().optional(),
  categoryId: z.boolean().optional(),
  category: z.union([z.boolean(), z.lazy(() => ProductCategoryArgsObjectSchema)]).optional(),
  subCategory: z.union([z.boolean(), z.lazy(() => SubCategoryArgsObjectSchema)]).optional(),
  subCategoryId: z.boolean().optional(),
  avgRating: z.boolean().optional(),
  noOfReviews: z.boolean().optional(),
  brand: z.boolean().optional(),
  companies: z.union([z.boolean(), z.lazy(() => CompanyFindManySchema)]).optional(),
  clients: z.union([z.boolean(), z.lazy(() => ClientProductFindManySchema)]).optional(),
  orderItems: z.union([z.boolean(), z.lazy(() => OrderItemFindManySchema)]).optional(),
  bundleOrderItems: z.union([z.boolean(), z.lazy(() => BundleOrderItemFindManySchema)]).optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  bundleItems: z.union([z.boolean(), z.lazy(() => BundleItemFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ProductCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ProductSelectObjectSchema: z.ZodType<Prisma.ProductSelect> = makeSchema() as unknown as z.ZodType<Prisma.ProductSelect>;
export const ProductSelectObjectZodSchema = makeSchema();
