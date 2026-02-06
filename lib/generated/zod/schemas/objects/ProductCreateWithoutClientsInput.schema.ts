import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCreateimagesInputObjectSchema as ProductCreateimagesInputObjectSchema } from './ProductCreateimagesInput.schema';
import { ReasonSchema } from '../enums/Reason.schema';
import { ProductCreateinventoryLogsInputObjectSchema as ProductCreateinventoryLogsInputObjectSchema } from './ProductCreateinventoryLogsInput.schema';
import { CategorySchema } from '../enums/Category.schema';
import { ProductCategoryCreateNestedOneWithoutProductsInputObjectSchema as ProductCategoryCreateNestedOneWithoutProductsInputObjectSchema } from './ProductCategoryCreateNestedOneWithoutProductsInput.schema';
import { SubCategoryCreateNestedOneWithoutProductsInputObjectSchema as SubCategoryCreateNestedOneWithoutProductsInputObjectSchema } from './SubCategoryCreateNestedOneWithoutProductsInput.schema';
import { CompanyCreateNestedManyWithoutProductsInputObjectSchema as CompanyCreateNestedManyWithoutProductsInputObjectSchema } from './CompanyCreateNestedManyWithoutProductsInput.schema';
import { OrderItemCreateNestedManyWithoutProductInputObjectSchema as OrderItemCreateNestedManyWithoutProductInputObjectSchema } from './OrderItemCreateNestedManyWithoutProductInput.schema';
import { BundleOrderItemCreateNestedManyWithoutProductInputObjectSchema as BundleOrderItemCreateNestedManyWithoutProductInputObjectSchema } from './BundleOrderItemCreateNestedManyWithoutProductInput.schema';
import { BundleItemCreateNestedManyWithoutProductInputObjectSchema as BundleItemCreateNestedManyWithoutProductInputObjectSchema } from './BundleItemCreateNestedManyWithoutProductInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().max(50),
  images: z.union([z.lazy(() => ProductCreateimagesInputObjectSchema), z.string().array()]).optional(),
  price: z.number().int().optional().nullable(),
  sku: z.string().max(100),
  availableStock: z.number().int(),
  minStockThreshold: z.number().int().optional().nullable(),
  inventoryUpdateReason: ReasonSchema.optional().nullable(),
  inventoryLogs: z.union([z.lazy(() => ProductCreateinventoryLogsInputObjectSchema), z.string().array()]).optional(),
  description: z.string(),
  categories: CategorySchema.optional().nullable(),
  avgRating: z.number().optional().nullable(),
  noOfReviews: z.number().int().optional().nullable(),
  brand: z.string().max(30).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  category: z.lazy(() => ProductCategoryCreateNestedOneWithoutProductsInputObjectSchema).optional(),
  subCategory: z.lazy(() => SubCategoryCreateNestedOneWithoutProductsInputObjectSchema).optional(),
  companies: z.lazy(() => CompanyCreateNestedManyWithoutProductsInputObjectSchema).optional(),
  orderItems: z.lazy(() => OrderItemCreateNestedManyWithoutProductInputObjectSchema).optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemCreateNestedManyWithoutProductInputObjectSchema).optional(),
  bundleItems: z.lazy(() => BundleItemCreateNestedManyWithoutProductInputObjectSchema).optional()
}).strict();
export const ProductCreateWithoutClientsInputObjectSchema: z.ZodType<Prisma.ProductCreateWithoutClientsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateWithoutClientsInput>;
export const ProductCreateWithoutClientsInputObjectZodSchema = makeSchema();
