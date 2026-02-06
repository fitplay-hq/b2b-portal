import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderCreateNestedOneWithoutOrderItemsInputObjectSchema as OrderCreateNestedOneWithoutOrderItemsInputObjectSchema } from './OrderCreateNestedOneWithoutOrderItemsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  quantity: z.number().int().optional(),
  price: z.number(),
  order: z.lazy(() => OrderCreateNestedOneWithoutOrderItemsInputObjectSchema)
}).strict();
export const OrderItemCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.OrderItemCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateWithoutProductInput>;
export const OrderItemCreateWithoutProductInputObjectZodSchema = makeSchema();
