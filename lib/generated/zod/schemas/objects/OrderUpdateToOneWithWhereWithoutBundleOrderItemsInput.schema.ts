import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { OrderUpdateWithoutBundleOrderItemsInputObjectSchema as OrderUpdateWithoutBundleOrderItemsInputObjectSchema } from './OrderUpdateWithoutBundleOrderItemsInput.schema';
import { OrderUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema as OrderUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema } from './OrderUncheckedUpdateWithoutBundleOrderItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => OrderUpdateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema)])
}).strict();
export const OrderUpdateToOneWithWhereWithoutBundleOrderItemsInputObjectSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutBundleOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutBundleOrderItemsInput>;
export const OrderUpdateToOneWithWhereWithoutBundleOrderItemsInputObjectZodSchema = makeSchema();
