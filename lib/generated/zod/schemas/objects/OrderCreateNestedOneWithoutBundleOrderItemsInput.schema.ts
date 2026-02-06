import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderCreateWithoutBundleOrderItemsInputObjectSchema as OrderCreateWithoutBundleOrderItemsInputObjectSchema } from './OrderCreateWithoutBundleOrderItemsInput.schema';
import { OrderUncheckedCreateWithoutBundleOrderItemsInputObjectSchema as OrderUncheckedCreateWithoutBundleOrderItemsInputObjectSchema } from './OrderUncheckedCreateWithoutBundleOrderItemsInput.schema';
import { OrderCreateOrConnectWithoutBundleOrderItemsInputObjectSchema as OrderCreateOrConnectWithoutBundleOrderItemsInputObjectSchema } from './OrderCreateOrConnectWithoutBundleOrderItemsInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutBundleOrderItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutBundleOrderItemsInputObjectSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional()
}).strict();
export const OrderCreateNestedOneWithoutBundleOrderItemsInputObjectSchema: z.ZodType<Prisma.OrderCreateNestedOneWithoutBundleOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateNestedOneWithoutBundleOrderItemsInput>;
export const OrderCreateNestedOneWithoutBundleOrderItemsInputObjectZodSchema = makeSchema();
