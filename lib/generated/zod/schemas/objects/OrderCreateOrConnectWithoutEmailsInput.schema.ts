import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderCreateWithoutEmailsInputObjectSchema as OrderCreateWithoutEmailsInputObjectSchema } from './OrderCreateWithoutEmailsInput.schema';
import { OrderUncheckedCreateWithoutEmailsInputObjectSchema as OrderUncheckedCreateWithoutEmailsInputObjectSchema } from './OrderUncheckedCreateWithoutEmailsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderCreateWithoutEmailsInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutEmailsInputObjectSchema)])
}).strict();
export const OrderCreateOrConnectWithoutEmailsInputObjectSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutEmailsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateOrConnectWithoutEmailsInput>;
export const OrderCreateOrConnectWithoutEmailsInputObjectZodSchema = makeSchema();
