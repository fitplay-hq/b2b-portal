import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { FloatFieldUpdateOperationsInputObjectSchema as FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { BundleItemUncheckedUpdateManyWithoutBundleOrderItemsNestedInputObjectSchema as BundleItemUncheckedUpdateManyWithoutBundleOrderItemsNestedInputObjectSchema } from './BundleItemUncheckedUpdateManyWithoutBundleOrderItemsNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  bundleId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  productId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  quantity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  price: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  bundleItems: z.lazy(() => BundleItemUncheckedUpdateManyWithoutBundleOrderItemsNestedInputObjectSchema).optional()
}).strict();
export const BundleOrderItemUncheckedUpdateWithoutOrderInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUncheckedUpdateWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUncheckedUpdateWithoutOrderInput>;
export const BundleOrderItemUncheckedUpdateWithoutOrderInputObjectZodSchema = makeSchema();
