import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderCreateWithoutEmailsInputObjectSchema as OrderCreateWithoutEmailsInputObjectSchema } from './OrderCreateWithoutEmailsInput.schema';
import { OrderUncheckedCreateWithoutEmailsInputObjectSchema as OrderUncheckedCreateWithoutEmailsInputObjectSchema } from './OrderUncheckedCreateWithoutEmailsInput.schema';
import { OrderCreateOrConnectWithoutEmailsInputObjectSchema as OrderCreateOrConnectWithoutEmailsInputObjectSchema } from './OrderCreateOrConnectWithoutEmailsInput.schema';
import { OrderUpsertWithoutEmailsInputObjectSchema as OrderUpsertWithoutEmailsInputObjectSchema } from './OrderUpsertWithoutEmailsInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderUpdateToOneWithWhereWithoutEmailsInputObjectSchema as OrderUpdateToOneWithWhereWithoutEmailsInputObjectSchema } from './OrderUpdateToOneWithWhereWithoutEmailsInput.schema';
import { OrderUpdateWithoutEmailsInputObjectSchema as OrderUpdateWithoutEmailsInputObjectSchema } from './OrderUpdateWithoutEmailsInput.schema';
import { OrderUncheckedUpdateWithoutEmailsInputObjectSchema as OrderUncheckedUpdateWithoutEmailsInputObjectSchema } from './OrderUncheckedUpdateWithoutEmailsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutEmailsInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutEmailsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutEmailsInputObjectSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutEmailsInputObjectSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => OrderUpdateToOneWithWhereWithoutEmailsInputObjectSchema), z.lazy(() => OrderUpdateWithoutEmailsInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutEmailsInputObjectSchema)]).optional()
}).strict();
export const OrderUpdateOneRequiredWithoutEmailsNestedInputObjectSchema: z.ZodType<Prisma.OrderUpdateOneRequiredWithoutEmailsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateOneRequiredWithoutEmailsNestedInput>;
export const OrderUpdateOneRequiredWithoutEmailsNestedInputObjectZodSchema = makeSchema();
