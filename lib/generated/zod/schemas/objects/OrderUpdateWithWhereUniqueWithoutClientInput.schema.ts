import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderUpdateWithoutClientInputObjectSchema as OrderUpdateWithoutClientInputObjectSchema } from './OrderUpdateWithoutClientInput.schema';
import { OrderUncheckedUpdateWithoutClientInputObjectSchema as OrderUncheckedUpdateWithoutClientInputObjectSchema } from './OrderUncheckedUpdateWithoutClientInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => OrderUpdateWithoutClientInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutClientInputObjectSchema)])
}).strict();
export const OrderUpdateWithWhereUniqueWithoutClientInputObjectSchema: z.ZodType<Prisma.OrderUpdateWithWhereUniqueWithoutClientInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateWithWhereUniqueWithoutClientInput>;
export const OrderUpdateWithWhereUniqueWithoutClientInputObjectZodSchema = makeSchema();
