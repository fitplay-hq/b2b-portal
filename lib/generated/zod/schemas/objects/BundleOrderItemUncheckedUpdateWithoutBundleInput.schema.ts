import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { FloatFieldUpdateOperationsInputObjectSchema as FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { BundleItemUncheckedUpdateManyWithoutBundleOrderItemsNestedInputObjectSchema as BundleItemUncheckedUpdateManyWithoutBundleOrderItemsNestedInputObjectSchema } from './BundleItemUncheckedUpdateManyWithoutBundleOrderItemsNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  orderId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  productId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  quantity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  price: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  bundleItems: z.lazy(() => BundleItemUncheckedUpdateManyWithoutBundleOrderItemsNestedInputObjectSchema).optional()
}).strict();
export const BundleOrderItemUncheckedUpdateWithoutBundleInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUncheckedUpdateWithoutBundleInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUncheckedUpdateWithoutBundleInput>;
export const BundleOrderItemUncheckedUpdateWithoutBundleInputObjectZodSchema = makeSchema();
