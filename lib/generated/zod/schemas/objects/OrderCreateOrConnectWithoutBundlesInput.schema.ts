import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderCreateWithoutBundlesInputObjectSchema as OrderCreateWithoutBundlesInputObjectSchema } from './OrderCreateWithoutBundlesInput.schema';
import { OrderUncheckedCreateWithoutBundlesInputObjectSchema as OrderUncheckedCreateWithoutBundlesInputObjectSchema } from './OrderUncheckedCreateWithoutBundlesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderCreateWithoutBundlesInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutBundlesInputObjectSchema)])
}).strict();
export const OrderCreateOrConnectWithoutBundlesInputObjectSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutBundlesInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateOrConnectWithoutBundlesInput>;
export const OrderCreateOrConnectWithoutBundlesInputObjectZodSchema = makeSchema();
