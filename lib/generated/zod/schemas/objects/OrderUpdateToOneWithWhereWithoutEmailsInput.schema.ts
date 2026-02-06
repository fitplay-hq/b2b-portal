import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { OrderUpdateWithoutEmailsInputObjectSchema as OrderUpdateWithoutEmailsInputObjectSchema } from './OrderUpdateWithoutEmailsInput.schema';
import { OrderUncheckedUpdateWithoutEmailsInputObjectSchema as OrderUncheckedUpdateWithoutEmailsInputObjectSchema } from './OrderUncheckedUpdateWithoutEmailsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => OrderUpdateWithoutEmailsInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutEmailsInputObjectSchema)])
}).strict();
export const OrderUpdateToOneWithWhereWithoutEmailsInputObjectSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutEmailsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutEmailsInput>;
export const OrderUpdateToOneWithWhereWithoutEmailsInputObjectZodSchema = makeSchema();
