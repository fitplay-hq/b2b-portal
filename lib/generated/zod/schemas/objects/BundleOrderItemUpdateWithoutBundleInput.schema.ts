import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { FloatFieldUpdateOperationsInputObjectSchema as FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { OrderUpdateOneRequiredWithoutBundleOrderItemsNestedInputObjectSchema as OrderUpdateOneRequiredWithoutBundleOrderItemsNestedInputObjectSchema } from './OrderUpdateOneRequiredWithoutBundleOrderItemsNestedInput.schema';
import { ProductUpdateOneRequiredWithoutBundleOrderItemsNestedInputObjectSchema as ProductUpdateOneRequiredWithoutBundleOrderItemsNestedInputObjectSchema } from './ProductUpdateOneRequiredWithoutBundleOrderItemsNestedInput.schema';
import { BundleItemUpdateManyWithoutBundleOrderItemsNestedInputObjectSchema as BundleItemUpdateManyWithoutBundleOrderItemsNestedInputObjectSchema } from './BundleItemUpdateManyWithoutBundleOrderItemsNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  quantity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  price: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutBundleOrderItemsNestedInputObjectSchema).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutBundleOrderItemsNestedInputObjectSchema).optional(),
  bundleItems: z.lazy(() => BundleItemUpdateManyWithoutBundleOrderItemsNestedInputObjectSchema).optional()
}).strict();
export const BundleOrderItemUpdateWithoutBundleInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUpdateWithoutBundleInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUpdateWithoutBundleInput>;
export const BundleOrderItemUpdateWithoutBundleInputObjectZodSchema = makeSchema();
