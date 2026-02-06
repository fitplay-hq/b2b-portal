import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { FloatFieldUpdateOperationsInputObjectSchema as FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductUpdateOneRequiredWithoutBundleItemsNestedInputObjectSchema as ProductUpdateOneRequiredWithoutBundleItemsNestedInputObjectSchema } from './ProductUpdateOneRequiredWithoutBundleItemsNestedInput.schema';
import { BundleOrderItemUpdateManyWithoutBundleItemsNestedInputObjectSchema as BundleOrderItemUpdateManyWithoutBundleItemsNestedInputObjectSchema } from './BundleOrderItemUpdateManyWithoutBundleItemsNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  bundleProductQuantity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  price: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutBundleItemsNestedInputObjectSchema).optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemUpdateManyWithoutBundleItemsNestedInputObjectSchema).optional()
}).strict();
export const BundleItemUpdateWithoutBundleInputObjectSchema: z.ZodType<Prisma.BundleItemUpdateWithoutBundleInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemUpdateWithoutBundleInput>;
export const BundleItemUpdateWithoutBundleInputObjectZodSchema = makeSchema();
