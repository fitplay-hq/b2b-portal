import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemUpdateWithoutProductInputObjectSchema as OrderItemUpdateWithoutProductInputObjectSchema } from './OrderItemUpdateWithoutProductInput.schema';
import { OrderItemUncheckedUpdateWithoutProductInputObjectSchema as OrderItemUncheckedUpdateWithoutProductInputObjectSchema } from './OrderItemUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => OrderItemUpdateWithoutProductInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutProductInputObjectSchema)])
}).strict();
export const OrderItemUpdateWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateWithWhereUniqueWithoutProductInput>;
export const OrderItemUpdateWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();
