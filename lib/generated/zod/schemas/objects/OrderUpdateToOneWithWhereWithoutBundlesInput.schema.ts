import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { OrderUpdateWithoutBundlesInputObjectSchema as OrderUpdateWithoutBundlesInputObjectSchema } from './OrderUpdateWithoutBundlesInput.schema';
import { OrderUncheckedUpdateWithoutBundlesInputObjectSchema as OrderUncheckedUpdateWithoutBundlesInputObjectSchema } from './OrderUncheckedUpdateWithoutBundlesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => OrderUpdateWithoutBundlesInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutBundlesInputObjectSchema)])
}).strict();
export const OrderUpdateToOneWithWhereWithoutBundlesInputObjectSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutBundlesInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutBundlesInput>;
export const OrderUpdateToOneWithWhereWithoutBundlesInputObjectZodSchema = makeSchema();
