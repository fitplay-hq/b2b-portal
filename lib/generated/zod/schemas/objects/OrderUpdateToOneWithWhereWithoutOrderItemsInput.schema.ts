import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { OrderUpdateWithoutOrderItemsInputObjectSchema as OrderUpdateWithoutOrderItemsInputObjectSchema } from './OrderUpdateWithoutOrderItemsInput.schema';
import { OrderUncheckedUpdateWithoutOrderItemsInputObjectSchema as OrderUncheckedUpdateWithoutOrderItemsInputObjectSchema } from './OrderUncheckedUpdateWithoutOrderItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => OrderUpdateWithoutOrderItemsInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutOrderItemsInputObjectSchema)])
}).strict();
export const OrderUpdateToOneWithWhereWithoutOrderItemsInputObjectSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutOrderItemsInput>;
export const OrderUpdateToOneWithWhereWithoutOrderItemsInputObjectZodSchema = makeSchema();
