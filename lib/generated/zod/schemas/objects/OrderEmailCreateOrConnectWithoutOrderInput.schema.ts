import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderEmailWhereUniqueInputObjectSchema as OrderEmailWhereUniqueInputObjectSchema } from './OrderEmailWhereUniqueInput.schema';
import { OrderEmailCreateWithoutOrderInputObjectSchema as OrderEmailCreateWithoutOrderInputObjectSchema } from './OrderEmailCreateWithoutOrderInput.schema';
import { OrderEmailUncheckedCreateWithoutOrderInputObjectSchema as OrderEmailUncheckedCreateWithoutOrderInputObjectSchema } from './OrderEmailUncheckedCreateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderEmailWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderEmailCreateWithoutOrderInputObjectSchema), z.lazy(() => OrderEmailUncheckedCreateWithoutOrderInputObjectSchema)])
}).strict();
export const OrderEmailCreateOrConnectWithoutOrderInputObjectSchema: z.ZodType<Prisma.OrderEmailCreateOrConnectWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderEmailCreateOrConnectWithoutOrderInput>;
export const OrderEmailCreateOrConnectWithoutOrderInputObjectZodSchema = makeSchema();
