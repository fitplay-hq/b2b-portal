import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemCreateWithoutProductInputObjectSchema as OrderItemCreateWithoutProductInputObjectSchema } from './OrderItemCreateWithoutProductInput.schema';
import { OrderItemUncheckedCreateWithoutProductInputObjectSchema as OrderItemUncheckedCreateWithoutProductInputObjectSchema } from './OrderItemUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderItemCreateWithoutProductInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const OrderItemCreateOrConnectWithoutProductInputObjectSchema: z.ZodType<Prisma.OrderItemCreateOrConnectWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateOrConnectWithoutProductInput>;
export const OrderItemCreateOrConnectWithoutProductInputObjectZodSchema = makeSchema();
