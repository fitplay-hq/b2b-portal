import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderUpdateWithoutOrderItemsInputObjectSchema as OrderUpdateWithoutOrderItemsInputObjectSchema } from './OrderUpdateWithoutOrderItemsInput.schema';
import { OrderUncheckedUpdateWithoutOrderItemsInputObjectSchema as OrderUncheckedUpdateWithoutOrderItemsInputObjectSchema } from './OrderUncheckedUpdateWithoutOrderItemsInput.schema';
import { OrderCreateWithoutOrderItemsInputObjectSchema as OrderCreateWithoutOrderItemsInputObjectSchema } from './OrderCreateWithoutOrderItemsInput.schema';
import { OrderUncheckedCreateWithoutOrderItemsInputObjectSchema as OrderUncheckedCreateWithoutOrderItemsInputObjectSchema } from './OrderUncheckedCreateWithoutOrderItemsInput.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => OrderUpdateWithoutOrderItemsInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutOrderItemsInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderCreateWithoutOrderItemsInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutOrderItemsInputObjectSchema)]),
  where: z.lazy(() => OrderWhereInputObjectSchema).optional()
}).strict();
export const OrderUpsertWithoutOrderItemsInputObjectSchema: z.ZodType<Prisma.OrderUpsertWithoutOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpsertWithoutOrderItemsInput>;
export const OrderUpsertWithoutOrderItemsInputObjectZodSchema = makeSchema();
