import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderEmailWhereUniqueInputObjectSchema as OrderEmailWhereUniqueInputObjectSchema } from './OrderEmailWhereUniqueInput.schema';
import { OrderEmailUpdateWithoutOrderInputObjectSchema as OrderEmailUpdateWithoutOrderInputObjectSchema } from './OrderEmailUpdateWithoutOrderInput.schema';
import { OrderEmailUncheckedUpdateWithoutOrderInputObjectSchema as OrderEmailUncheckedUpdateWithoutOrderInputObjectSchema } from './OrderEmailUncheckedUpdateWithoutOrderInput.schema';
import { OrderEmailCreateWithoutOrderInputObjectSchema as OrderEmailCreateWithoutOrderInputObjectSchema } from './OrderEmailCreateWithoutOrderInput.schema';
import { OrderEmailUncheckedCreateWithoutOrderInputObjectSchema as OrderEmailUncheckedCreateWithoutOrderInputObjectSchema } from './OrderEmailUncheckedCreateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderEmailWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => OrderEmailUpdateWithoutOrderInputObjectSchema), z.lazy(() => OrderEmailUncheckedUpdateWithoutOrderInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderEmailCreateWithoutOrderInputObjectSchema), z.lazy(() => OrderEmailUncheckedCreateWithoutOrderInputObjectSchema)])
}).strict();
export const OrderEmailUpsertWithWhereUniqueWithoutOrderInputObjectSchema: z.ZodType<Prisma.OrderEmailUpsertWithWhereUniqueWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderEmailUpsertWithWhereUniqueWithoutOrderInput>;
export const OrderEmailUpsertWithWhereUniqueWithoutOrderInputObjectZodSchema = makeSchema();
