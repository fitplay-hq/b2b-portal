import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemUpdateWithoutOrderInputObjectSchema as OrderItemUpdateWithoutOrderInputObjectSchema } from './OrderItemUpdateWithoutOrderInput.schema';
import { OrderItemUncheckedUpdateWithoutOrderInputObjectSchema as OrderItemUncheckedUpdateWithoutOrderInputObjectSchema } from './OrderItemUncheckedUpdateWithoutOrderInput.schema';
import { OrderItemCreateWithoutOrderInputObjectSchema as OrderItemCreateWithoutOrderInputObjectSchema } from './OrderItemCreateWithoutOrderInput.schema';
import { OrderItemUncheckedCreateWithoutOrderInputObjectSchema as OrderItemUncheckedCreateWithoutOrderInputObjectSchema } from './OrderItemUncheckedCreateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => OrderItemUpdateWithoutOrderInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutOrderInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderItemCreateWithoutOrderInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputObjectSchema)])
}).strict();
export const OrderItemUpsertWithWhereUniqueWithoutOrderInputObjectSchema: z.ZodType<Prisma.OrderItemUpsertWithWhereUniqueWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpsertWithWhereUniqueWithoutOrderInput>;
export const OrderItemUpsertWithWhereUniqueWithoutOrderInputObjectZodSchema = makeSchema();
