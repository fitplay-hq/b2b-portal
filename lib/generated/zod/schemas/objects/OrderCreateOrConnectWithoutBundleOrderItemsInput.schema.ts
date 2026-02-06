import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderCreateWithoutBundleOrderItemsInputObjectSchema as OrderCreateWithoutBundleOrderItemsInputObjectSchema } from './OrderCreateWithoutBundleOrderItemsInput.schema';
import { OrderUncheckedCreateWithoutBundleOrderItemsInputObjectSchema as OrderUncheckedCreateWithoutBundleOrderItemsInputObjectSchema } from './OrderUncheckedCreateWithoutBundleOrderItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderCreateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutBundleOrderItemsInputObjectSchema)])
}).strict();
export const OrderCreateOrConnectWithoutBundleOrderItemsInputObjectSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutBundleOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateOrConnectWithoutBundleOrderItemsInput>;
export const OrderCreateOrConnectWithoutBundleOrderItemsInputObjectZodSchema = makeSchema();
