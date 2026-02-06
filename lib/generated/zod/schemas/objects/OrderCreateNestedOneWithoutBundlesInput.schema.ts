import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderCreateWithoutBundlesInputObjectSchema as OrderCreateWithoutBundlesInputObjectSchema } from './OrderCreateWithoutBundlesInput.schema';
import { OrderUncheckedCreateWithoutBundlesInputObjectSchema as OrderUncheckedCreateWithoutBundlesInputObjectSchema } from './OrderUncheckedCreateWithoutBundlesInput.schema';
import { OrderCreateOrConnectWithoutBundlesInputObjectSchema as OrderCreateOrConnectWithoutBundlesInputObjectSchema } from './OrderCreateOrConnectWithoutBundlesInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutBundlesInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutBundlesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutBundlesInputObjectSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional()
}).strict();
export const OrderCreateNestedOneWithoutBundlesInputObjectSchema: z.ZodType<Prisma.OrderCreateNestedOneWithoutBundlesInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateNestedOneWithoutBundlesInput>;
export const OrderCreateNestedOneWithoutBundlesInputObjectZodSchema = makeSchema();
