import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderUpdateWithoutBundlesInputObjectSchema as OrderUpdateWithoutBundlesInputObjectSchema } from './OrderUpdateWithoutBundlesInput.schema';
import { OrderUncheckedUpdateWithoutBundlesInputObjectSchema as OrderUncheckedUpdateWithoutBundlesInputObjectSchema } from './OrderUncheckedUpdateWithoutBundlesInput.schema';
import { OrderCreateWithoutBundlesInputObjectSchema as OrderCreateWithoutBundlesInputObjectSchema } from './OrderCreateWithoutBundlesInput.schema';
import { OrderUncheckedCreateWithoutBundlesInputObjectSchema as OrderUncheckedCreateWithoutBundlesInputObjectSchema } from './OrderUncheckedCreateWithoutBundlesInput.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => OrderUpdateWithoutBundlesInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutBundlesInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderCreateWithoutBundlesInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutBundlesInputObjectSchema)]),
  where: z.lazy(() => OrderWhereInputObjectSchema).optional()
}).strict();
export const OrderUpsertWithoutBundlesInputObjectSchema: z.ZodType<Prisma.OrderUpsertWithoutBundlesInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpsertWithoutBundlesInput>;
export const OrderUpsertWithoutBundlesInputObjectZodSchema = makeSchema();
