import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderUpdateWithoutBundleOrderItemsInputObjectSchema as OrderUpdateWithoutBundleOrderItemsInputObjectSchema } from './OrderUpdateWithoutBundleOrderItemsInput.schema';
import { OrderUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema as OrderUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema } from './OrderUncheckedUpdateWithoutBundleOrderItemsInput.schema';
import { OrderCreateWithoutBundleOrderItemsInputObjectSchema as OrderCreateWithoutBundleOrderItemsInputObjectSchema } from './OrderCreateWithoutBundleOrderItemsInput.schema';
import { OrderUncheckedCreateWithoutBundleOrderItemsInputObjectSchema as OrderUncheckedCreateWithoutBundleOrderItemsInputObjectSchema } from './OrderUncheckedCreateWithoutBundleOrderItemsInput.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => OrderUpdateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderCreateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutBundleOrderItemsInputObjectSchema)]),
  where: z.lazy(() => OrderWhereInputObjectSchema).optional()
}).strict();
export const OrderUpsertWithoutBundleOrderItemsInputObjectSchema: z.ZodType<Prisma.OrderUpsertWithoutBundleOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpsertWithoutBundleOrderItemsInput>;
export const OrderUpsertWithoutBundleOrderItemsInputObjectZodSchema = makeSchema();
