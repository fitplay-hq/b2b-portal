import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderEmailWhereUniqueInputObjectSchema as OrderEmailWhereUniqueInputObjectSchema } from './OrderEmailWhereUniqueInput.schema';
import { OrderEmailUpdateWithoutOrderInputObjectSchema as OrderEmailUpdateWithoutOrderInputObjectSchema } from './OrderEmailUpdateWithoutOrderInput.schema';
import { OrderEmailUncheckedUpdateWithoutOrderInputObjectSchema as OrderEmailUncheckedUpdateWithoutOrderInputObjectSchema } from './OrderEmailUncheckedUpdateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderEmailWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => OrderEmailUpdateWithoutOrderInputObjectSchema), z.lazy(() => OrderEmailUncheckedUpdateWithoutOrderInputObjectSchema)])
}).strict();
export const OrderEmailUpdateWithWhereUniqueWithoutOrderInputObjectSchema: z.ZodType<Prisma.OrderEmailUpdateWithWhereUniqueWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderEmailUpdateWithWhereUniqueWithoutOrderInput>;
export const OrderEmailUpdateWithWhereUniqueWithoutOrderInputObjectZodSchema = makeSchema();
