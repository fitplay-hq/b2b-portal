import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderCreateNestedOneWithoutOrderItemsInputObjectSchema as OrderCreateNestedOneWithoutOrderItemsInputObjectSchema } from './OrderCreateNestedOneWithoutOrderItemsInput.schema';
import { ProductCreateNestedOneWithoutOrderItemsInputObjectSchema as ProductCreateNestedOneWithoutOrderItemsInputObjectSchema } from './ProductCreateNestedOneWithoutOrderItemsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  quantity: z.number().int().optional(),
  price: z.number(),
  order: z.lazy(() => OrderCreateNestedOneWithoutOrderItemsInputObjectSchema),
  product: z.lazy(() => ProductCreateNestedOneWithoutOrderItemsInputObjectSchema)
}).strict();
export const OrderItemCreateInputObjectSchema: z.ZodType<Prisma.OrderItemCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateInput>;
export const OrderItemCreateInputObjectZodSchema = makeSchema();
