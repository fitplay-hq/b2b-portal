import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { IntFieldUpdateOperationsInputObjectSchema as IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { FloatFieldUpdateOperationsInputObjectSchema as FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { OrderUpdateOneRequiredWithoutOrderItemsNestedInputObjectSchema as OrderUpdateOneRequiredWithoutOrderItemsNestedInputObjectSchema } from './OrderUpdateOneRequiredWithoutOrderItemsNestedInput.schema';
import { ProductUpdateOneRequiredWithoutOrderItemsNestedInputObjectSchema as ProductUpdateOneRequiredWithoutOrderItemsNestedInputObjectSchema } from './ProductUpdateOneRequiredWithoutOrderItemsNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  quantity: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputObjectSchema)]).optional(),
  price: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutOrderItemsNestedInputObjectSchema).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutOrderItemsNestedInputObjectSchema).optional()
}).strict();
export const OrderItemUpdateInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateInput>;
export const OrderItemUpdateInputObjectZodSchema = makeSchema();
