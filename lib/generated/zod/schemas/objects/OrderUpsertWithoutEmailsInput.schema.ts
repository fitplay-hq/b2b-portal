import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderUpdateWithoutEmailsInputObjectSchema as OrderUpdateWithoutEmailsInputObjectSchema } from './OrderUpdateWithoutEmailsInput.schema';
import { OrderUncheckedUpdateWithoutEmailsInputObjectSchema as OrderUncheckedUpdateWithoutEmailsInputObjectSchema } from './OrderUncheckedUpdateWithoutEmailsInput.schema';
import { OrderCreateWithoutEmailsInputObjectSchema as OrderCreateWithoutEmailsInputObjectSchema } from './OrderCreateWithoutEmailsInput.schema';
import { OrderUncheckedCreateWithoutEmailsInputObjectSchema as OrderUncheckedCreateWithoutEmailsInputObjectSchema } from './OrderUncheckedCreateWithoutEmailsInput.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => OrderUpdateWithoutEmailsInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutEmailsInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderCreateWithoutEmailsInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutEmailsInputObjectSchema)]),
  where: z.lazy(() => OrderWhereInputObjectSchema).optional()
}).strict();
export const OrderUpsertWithoutEmailsInputObjectSchema: z.ZodType<Prisma.OrderUpsertWithoutEmailsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpsertWithoutEmailsInput>;
export const OrderUpsertWithoutEmailsInputObjectZodSchema = makeSchema();
