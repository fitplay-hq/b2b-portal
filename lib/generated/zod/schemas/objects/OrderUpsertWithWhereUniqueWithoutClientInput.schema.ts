import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderUpdateWithoutClientInputObjectSchema as OrderUpdateWithoutClientInputObjectSchema } from './OrderUpdateWithoutClientInput.schema';
import { OrderUncheckedUpdateWithoutClientInputObjectSchema as OrderUncheckedUpdateWithoutClientInputObjectSchema } from './OrderUncheckedUpdateWithoutClientInput.schema';
import { OrderCreateWithoutClientInputObjectSchema as OrderCreateWithoutClientInputObjectSchema } from './OrderCreateWithoutClientInput.schema';
import { OrderUncheckedCreateWithoutClientInputObjectSchema as OrderUncheckedCreateWithoutClientInputObjectSchema } from './OrderUncheckedCreateWithoutClientInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => OrderUpdateWithoutClientInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutClientInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderCreateWithoutClientInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutClientInputObjectSchema)])
}).strict();
export const OrderUpsertWithWhereUniqueWithoutClientInputObjectSchema: z.ZodType<Prisma.OrderUpsertWithWhereUniqueWithoutClientInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpsertWithWhereUniqueWithoutClientInput>;
export const OrderUpsertWithWhereUniqueWithoutClientInputObjectZodSchema = makeSchema();
