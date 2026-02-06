import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemCreateWithoutOrderInputObjectSchema as OrderItemCreateWithoutOrderInputObjectSchema } from './OrderItemCreateWithoutOrderInput.schema';
import { OrderItemUncheckedCreateWithoutOrderInputObjectSchema as OrderItemUncheckedCreateWithoutOrderInputObjectSchema } from './OrderItemUncheckedCreateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderItemCreateWithoutOrderInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputObjectSchema)])
}).strict();
export const OrderItemCreateOrConnectWithoutOrderInputObjectSchema: z.ZodType<Prisma.OrderItemCreateOrConnectWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateOrConnectWithoutOrderInput>;
export const OrderItemCreateOrConnectWithoutOrderInputObjectZodSchema = makeSchema();
