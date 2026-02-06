import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { ProductUpdateimagesInputObjectSchema as ProductUpdateimagesInputObjectSchema } from './ProductUpdateimagesInput.schema';
import { NullableIntFieldUpdateOperationsInputObjectSchema as NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { ReasonSchema } from '../enums/Reason.schema';
import { NullableEnumReasonFieldUpdateOperationsInputObjectSchema as NullableEnumReasonFieldUpdateOperationsInputObjectSchema } from './NullableEnumReasonFieldUpdateOperationsInput.schema';
import { ProductUpdateinventoryLogsInputObjectSchema as ProductUpdateinventoryLogsInputObjectSchema } from './ProductUpdateinventoryLogsInput.schema';
import { CategorySchema } from '../enums/Category.schema';
import { NullableEnumCategoryFieldUpdateOperationsInputObjectSchema as NullableEnumCategoryFieldUpdateOperationsInputObjectSchema } from './NullableEnumCategoryFieldUpdateOperationsInput.schema';
import { NullableFloatFieldUpdateOperationsInputObjectSchema as NullableFloatFieldUpdateOperationsInputObjectSchema } from './NullableFloatFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductCategoryUpdateOneWithoutProductsNestedInputObjectSchema as ProductCategoryUpdateOneWithoutProductsNestedInputObjectSchema } from './ProductCategoryUpdateOneWithoutProductsNestedInput.schema';
import { SubCategoryUpdateOneWithoutProductsNestedInputObjectSchema as SubCategoryUpdateOneWithoutProductsNestedInputObjectSchema } from './SubCategoryUpdateOneWithoutProductsNestedInput.schema';
import { CompanyUpdateManyWithoutProductsNestedInputObjectSchema as CompanyUpdateManyWithoutProductsNestedInputObjectSchema } from './CompanyUpdateManyWithoutProductsNestedInput.schema';
import { ClientProductUpdateManyWithoutProductNestedInputObjectSchema as ClientProductUpdateManyWithoutProductNestedInputObjectSchema } from './ClientProductUpdateManyWithoutProductNestedInput.schema';
import { OrderItemUpdateManyWithoutProductNestedInputObjectSchema as OrderItemUpdateManyWithoutProductNestedInputObjectSchema } from './OrderItemUpdateManyWithoutProductNestedInput.schema';
import { BundleOrderItemUpdateManyWithoutProductNestedInputObjectSchema as BundleOrderItemUpdateManyWithoutProductNestedInputObjectSchema } from './BundleOrderItemUpdateManyWithoutProductNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string().max(50), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  images: z.union([z.lazy(() => ProductUpdateimagesInputObjectSchema), z.string().array()]).optional(),
  price: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  sku: z.union([z.string().max(100), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  availableStock: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  minStockThreshold: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  inventoryUpdateReason: z.union([ReasonSchema, z.lazy(() => NullableEnumReasonFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  inventoryLogs: z.union([z.lazy(() => ProductUpdateinventoryLogsInputObjectSchema), z.string().array()]).optional(),
  description: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  categories: z.union([CategorySchema, z.lazy(() => NullableEnumCategoryFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  avgRating: z.union([z.number(), z.lazy(() => NullableFloatFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  noOfReviews: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  brand: z.union([z.string().max(30), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  category: z.lazy(() => ProductCategoryUpdateOneWithoutProductsNestedInputObjectSchema).optional(),
  subCategory: z.lazy(() => SubCategoryUpdateOneWithoutProductsNestedInputObjectSchema).optional(),
  companies: z.lazy(() => CompanyUpdateManyWithoutProductsNestedInputObjectSchema).optional(),
  clients: z.lazy(() => ClientProductUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  orderItems: z.lazy(() => OrderItemUpdateManyWithoutProductNestedInputObjectSchema).optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemUpdateManyWithoutProductNestedInputObjectSchema).optional()
}).strict();
export const ProductUpdateWithoutBundleItemsInputObjectSchema: z.ZodType<Prisma.ProductUpdateWithoutBundleItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateWithoutBundleItemsInput>;
export const ProductUpdateWithoutBundleItemsInputObjectZodSchema = makeSchema();
