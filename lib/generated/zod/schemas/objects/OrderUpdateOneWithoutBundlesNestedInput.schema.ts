import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderCreateWithoutBundlesInputObjectSchema as OrderCreateWithoutBundlesInputObjectSchema } from './OrderCreateWithoutBundlesInput.schema';
import { OrderUncheckedCreateWithoutBundlesInputObjectSchema as OrderUncheckedCreateWithoutBundlesInputObjectSchema } from './OrderUncheckedCreateWithoutBundlesInput.schema';
import { OrderCreateOrConnectWithoutBundlesInputObjectSchema as OrderCreateOrConnectWithoutBundlesInputObjectSchema } from './OrderCreateOrConnectWithoutBundlesInput.schema';
import { OrderUpsertWithoutBundlesInputObjectSchema as OrderUpsertWithoutBundlesInputObjectSchema } from './OrderUpsertWithoutBundlesInput.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderUpdateToOneWithWhereWithoutBundlesInputObjectSchema as OrderUpdateToOneWithWhereWithoutBundlesInputObjectSchema } from './OrderUpdateToOneWithWhereWithoutBundlesInput.schema';
import { OrderUpdateWithoutBundlesInputObjectSchema as OrderUpdateWithoutBundlesInputObjectSchema } from './OrderUpdateWithoutBundlesInput.schema';
import { OrderUncheckedUpdateWithoutBundlesInputObjectSchema as OrderUncheckedUpdateWithoutBundlesInputObjectSchema } from './OrderUncheckedUpdateWithoutBundlesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutBundlesInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutBundlesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutBundlesInputObjectSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutBundlesInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => OrderWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => OrderWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => OrderUpdateToOneWithWhereWithoutBundlesInputObjectSchema), z.lazy(() => OrderUpdateWithoutBundlesInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutBundlesInputObjectSchema)]).optional()
}).strict();
export const OrderUpdateOneWithoutBundlesNestedInputObjectSchema: z.ZodType<Prisma.OrderUpdateOneWithoutBundlesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateOneWithoutBundlesNestedInput>;
export const OrderUpdateOneWithoutBundlesNestedInputObjectZodSchema = makeSchema();
