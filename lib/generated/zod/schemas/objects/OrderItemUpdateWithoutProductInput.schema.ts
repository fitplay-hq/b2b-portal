import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { FloatFieldUpdateOperationsInputObjectSchema as FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { OrderUpdateOneRequiredWithoutOrderItemsNestedInputObjectSchema as OrderUpdateOneRequiredWithoutOrderItemsNestedInputObjectSchema } from './OrderUpdateOneRequiredWithoutOrderItemsNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  quantity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  price: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutOrderItemsNestedInputObjectSchema).optional()
}).strict();
export const OrderItemUpdateWithoutProductInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateWithoutProductInput>;
export const OrderItemUpdateWithoutProductInputObjectZodSchema = makeSchema();
