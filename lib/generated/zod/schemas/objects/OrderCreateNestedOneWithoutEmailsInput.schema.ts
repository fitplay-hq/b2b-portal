import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderCreateWithoutEmailsInputObjectSchema as OrderCreateWithoutEmailsInputObjectSchema } from './OrderCreateWithoutEmailsInput.schema';
import { OrderUncheckedCreateWithoutEmailsInputObjectSchema as OrderUncheckedCreateWithoutEmailsInputObjectSchema } from './OrderUncheckedCreateWithoutEmailsInput.schema';
import { OrderCreateOrConnectWithoutEmailsInputObjectSchema as OrderCreateOrConnectWithoutEmailsInputObjectSchema } from './OrderCreateOrConnectWithoutEmailsInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutEmailsInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutEmailsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutEmailsInputObjectSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional()
}).strict();
export const OrderCreateNestedOneWithoutEmailsInputObjectSchema: z.ZodType<Prisma.OrderCreateNestedOneWithoutEmailsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateNestedOneWithoutEmailsInput>;
export const OrderCreateNestedOneWithoutEmailsInputObjectZodSchema = makeSchema();
