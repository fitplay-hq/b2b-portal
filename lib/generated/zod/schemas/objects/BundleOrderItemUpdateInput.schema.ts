import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { FloatFieldUpdateOperationsInputObjectSchema as FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { BundleUpdateOneRequiredWithoutBundleOrderItemsNestedInputObjectSchema as BundleUpdateOneRequiredWithoutBundleOrderItemsNestedInputObjectSchema } from './BundleUpdateOneRequiredWithoutBundleOrderItemsNestedInput.schema';
import { OrderUpdateOneRequiredWithoutBundleOrderItemsNestedInputObjectSchema as OrderUpdateOneRequiredWithoutBundleOrderItemsNestedInputObjectSchema } from './OrderUpdateOneRequiredWithoutBundleOrderItemsNestedInput.schema';
import { ProductUpdateOneRequiredWithoutBundleOrderItemsNestedInputObjectSchema as ProductUpdateOneRequiredWithoutBundleOrderItemsNestedInputObjectSchema } from './ProductUpdateOneRequiredWithoutBundleOrderItemsNestedInput.schema';
import { BundleItemUpdateManyWithoutBundleOrderItemsNestedInputObjectSchema as BundleItemUpdateManyWithoutBundleOrderItemsNestedInputObjectSchema } from './BundleItemUpdateManyWithoutBundleOrderItemsNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  quantity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  price: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  bundle: z.lazy(() => BundleUpdateOneRequiredWithoutBundleOrderItemsNestedInputObjectSchema).optional(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutBundleOrderItemsNestedInputObjectSchema).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutBundleOrderItemsNestedInputObjectSchema).optional(),
  bundleItems: z.lazy(() => BundleItemUpdateManyWithoutBundleOrderItemsNestedInputObjectSchema).optional()
}).strict();
export const BundleOrderItemUpdateInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUpdateInput>;
export const BundleOrderItemUpdateInputObjectZodSchema = makeSchema();
