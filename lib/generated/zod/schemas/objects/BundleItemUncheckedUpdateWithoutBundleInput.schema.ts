import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { FloatFieldUpdateOperationsInputObjectSchema as FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { BundleOrderItemUncheckedUpdateManyWithoutBundleItemsNestedInputObjectSchema as BundleOrderItemUncheckedUpdateManyWithoutBundleItemsNestedInputObjectSchema } from './BundleOrderItemUncheckedUpdateManyWithoutBundleItemsNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  productId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  bundleProductQuantity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  price: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemUncheckedUpdateManyWithoutBundleItemsNestedInputObjectSchema).optional()
}).strict();
export const BundleItemUncheckedUpdateWithoutBundleInputObjectSchema: z.ZodType<Prisma.BundleItemUncheckedUpdateWithoutBundleInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemUncheckedUpdateWithoutBundleInput>;
export const BundleItemUncheckedUpdateWithoutBundleInputObjectZodSchema = makeSchema();
