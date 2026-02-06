import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderCreateWithoutOrderItemsInputObjectSchema as OrderCreateWithoutOrderItemsInputObjectSchema } from './OrderCreateWithoutOrderItemsInput.schema';
import { OrderUncheckedCreateWithoutOrderItemsInputObjectSchema as OrderUncheckedCreateWithoutOrderItemsInputObjectSchema } from './OrderUncheckedCreateWithoutOrderItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderCreateWithoutOrderItemsInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutOrderItemsInputObjectSchema)])
}).strict();
export const OrderCreateOrConnectWithoutOrderItemsInputObjectSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateOrConnectWithoutOrderItemsInput>;
export const OrderCreateOrConnectWithoutOrderItemsInputObjectZodSchema = makeSchema();
