import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StatusSchema } from '../enums/Status.schema'

const makeSchema = () => z.object({
  orderId: z.string(),
  purpose: StatusSchema
}).strict();
export const OrderEmailOrderIdPurposeCompoundUniqueInputObjectSchema: z.ZodType<Prisma.OrderEmailOrderIdPurposeCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderEmailOrderIdPurposeCompoundUniqueInput>;
export const OrderEmailOrderIdPurposeCompoundUniqueInputObjectZodSchema = makeSchema();
