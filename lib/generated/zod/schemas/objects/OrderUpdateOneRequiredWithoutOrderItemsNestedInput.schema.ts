import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderCreateWithoutOrderItemsInputObjectSchema as OrderCreateWithoutOrderItemsInputObjectSchema } from './OrderCreateWithoutOrderItemsInput.schema';
import { OrderUncheckedCreateWithoutOrderItemsInputObjectSchema as OrderUncheckedCreateWithoutOrderItemsInputObjectSchema } from './OrderUncheckedCreateWithoutOrderItemsInput.schema';
import { OrderCreateOrConnectWithoutOrderItemsInputObjectSchema as OrderCreateOrConnectWithoutOrderItemsInputObjectSchema } from './OrderCreateOrConnectWithoutOrderItemsInput.schema';
import { OrderUpsertWithoutOrderItemsInputObjectSchema as OrderUpsertWithoutOrderItemsInputObjectSchema } from './OrderUpsertWithoutOrderItemsInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderUpdateToOneWithWhereWithoutOrderItemsInputObjectSchema as OrderUpdateToOneWithWhereWithoutOrderItemsInputObjectSchema } from './OrderUpdateToOneWithWhereWithoutOrderItemsInput.schema';
import { OrderUpdateWithoutOrderItemsInputObjectSchema as OrderUpdateWithoutOrderItemsInputObjectSchema } from './OrderUpdateWithoutOrderItemsInput.schema';
import { OrderUncheckedUpdateWithoutOrderItemsInputObjectSchema as OrderUncheckedUpdateWithoutOrderItemsInputObjectSchema } from './OrderUncheckedUpdateWithoutOrderItemsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutOrderItemsInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutOrderItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutOrderItemsInputObjectSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutOrderItemsInputObjectSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => OrderUpdateToOneWithWhereWithoutOrderItemsInputObjectSchema), z.lazy(() => OrderUpdateWithoutOrderItemsInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutOrderItemsInputObjectSchema)]).optional()
}).strict();
export const OrderUpdateOneRequiredWithoutOrderItemsNestedInputObjectSchema: z.ZodType<Prisma.OrderUpdateOneRequiredWithoutOrderItemsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateOneRequiredWithoutOrderItemsNestedInput>;
export const OrderUpdateOneRequiredWithoutOrderItemsNestedInputObjectZodSchema = makeSchema();
