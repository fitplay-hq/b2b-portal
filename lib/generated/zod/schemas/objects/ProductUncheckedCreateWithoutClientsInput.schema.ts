import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCreateimagesInputObjectSchema as ProductCreateimagesInputObjectSchema } from './ProductCreateimagesInput.schema';
import { ReasonSchema } from '../enums/Reason.schema';
import { ProductCreateinventoryLogsInputObjectSchema as ProductCreateinventoryLogsInputObjectSchema } from './ProductCreateinventoryLogsInput.schema';
import { CategorySchema } from '../enums/Category.schema';
import { CompanyUncheckedCreateNestedManyWithoutProductsInputObjectSchema as CompanyUncheckedCreateNestedManyWithoutProductsInputObjectSchema } from './CompanyUncheckedCreateNestedManyWithoutProductsInput.schema';
import { OrderItemUncheckedCreateNestedManyWithoutProductInputObjectSchema as OrderItemUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './OrderItemUncheckedCreateNestedManyWithoutProductInput.schema';
import { BundleOrderItemUncheckedCreateNestedManyWithoutProductInputObjectSchema as BundleOrderItemUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './BundleOrderItemUncheckedCreateNestedManyWithoutProductInput.schema';
import { BundleItemUncheckedCreateNestedManyWithoutProductInputObjectSchema as BundleItemUncheckedCreateNestedManyWithoutProductInputObjectSchema } from './BundleItemUncheckedCreateNestedManyWithoutProductInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  images: z.union([z.lazy(() => ProductCreateimagesInputObjectSchema), z.string().array()]).optional(),
  price: z.number().int().optional().nullable(),
  sku: z.string(),
  availableStock: z.number().int(),
  minStockThreshold: z.number().int().optional().nullable(),
  inventoryUpdateReason: ReasonSchema.optional().nullable(),
  inventoryLogs: z.union([z.lazy(() => ProductCreateinventoryLogsInputObjectSchema), z.string().array()]).optional(),
  description: z.string(),
  categories: CategorySchema.optional().nullable(),
  categoryId: z.string().optional().nullable(),
  subCategoryId: z.string().optional().nullable(),
  avgRating: z.number().optional().nullable(),
  noOfReviews: z.number().int().optional().nullable(),
  brand: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  companies: z.lazy(() => CompanyUncheckedCreateNestedManyWithoutProductsInputObjectSchema).optional(),
  orderItems: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional(),
  bundleItems: z.lazy(() => BundleItemUncheckedCreateNestedManyWithoutProductInputObjectSchema).optional()
}).strict();
export const ProductUncheckedCreateWithoutClientsInputObjectSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutClientsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUncheckedCreateWithoutClientsInput>;
export const ProductUncheckedCreateWithoutClientsInputObjectZodSchema = makeSchema();
