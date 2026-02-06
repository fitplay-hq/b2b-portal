import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderCreateWithoutBundleOrderItemsInputObjectSchema as OrderCreateWithoutBundleOrderItemsInputObjectSchema } from './OrderCreateWithoutBundleOrderItemsInput.schema';
import { OrderUncheckedCreateWithoutBundleOrderItemsInputObjectSchema as OrderUncheckedCreateWithoutBundleOrderItemsInputObjectSchema } from './OrderUncheckedCreateWithoutBundleOrderItemsInput.schema';
import { OrderCreateOrConnectWithoutBundleOrderItemsInputObjectSchema as OrderCreateOrConnectWithoutBundleOrderItemsInputObjectSchema } from './OrderCreateOrConnectWithoutBundleOrderItemsInput.schema';
import { OrderUpsertWithoutBundleOrderItemsInputObjectSchema as OrderUpsertWithoutBundleOrderItemsInputObjectSchema } from './OrderUpsertWithoutBundleOrderItemsInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderUpdateToOneWithWhereWithoutBundleOrderItemsInputObjectSchema as OrderUpdateToOneWithWhereWithoutBundleOrderItemsInputObjectSchema } from './OrderUpdateToOneWithWhereWithoutBundleOrderItemsInput.schema';
import { OrderUpdateWithoutBundleOrderItemsInputObjectSchema as OrderUpdateWithoutBundleOrderItemsInputObjectSchema } from './OrderUpdateWithoutBundleOrderItemsInput.schema';
import { OrderUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema as OrderUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema } from './OrderUncheckedUpdateWithoutBundleOrderItemsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutBundleOrderItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutBundleOrderItemsInputObjectSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutBundleOrderItemsInputObjectSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => OrderUpdateToOneWithWhereWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => OrderUpdateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema)]).optional()
}).strict();
export const OrderUpdateOneRequiredWithoutBundleOrderItemsNestedInputObjectSchema: z.ZodType<Prisma.OrderUpdateOneRequiredWithoutBundleOrderItemsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateOneRequiredWithoutBundleOrderItemsNestedInput>;
export const OrderUpdateOneRequiredWithoutBundleOrderItemsNestedInputObjectZodSchema = makeSchema();
