import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderCreateWithoutClientInputObjectSchema as OrderCreateWithoutClientInputObjectSchema } from './OrderCreateWithoutClientInput.schema';
import { OrderUncheckedCreateWithoutClientInputObjectSchema as OrderUncheckedCreateWithoutClientInputObjectSchema } from './OrderUncheckedCreateWithoutClientInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderCreateWithoutClientInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutClientInputObjectSchema)])
}).strict();
export const OrderCreateOrConnectWithoutClientInputObjectSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutClientInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateOrConnectWithoutClientInput>;
export const OrderCreateOrConnectWithoutClientInputObjectZodSchema = makeSchema();
