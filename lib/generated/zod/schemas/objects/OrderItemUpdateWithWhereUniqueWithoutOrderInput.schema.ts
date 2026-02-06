import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemUpdateWithoutOrderInputObjectSchema as OrderItemUpdateWithoutOrderInputObjectSchema } from './OrderItemUpdateWithoutOrderInput.schema';
import { OrderItemUncheckedUpdateWithoutOrderInputObjectSchema as OrderItemUncheckedUpdateWithoutOrderInputObjectSchema } from './OrderItemUncheckedUpdateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => OrderItemUpdateWithoutOrderInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutOrderInputObjectSchema)])
}).strict();
export const OrderItemUpdateWithWhereUniqueWithoutOrderInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateWithWhereUniqueWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateWithWhereUniqueWithoutOrderInput>;
export const OrderItemUpdateWithWhereUniqueWithoutOrderInputObjectZodSchema = makeSchema();
