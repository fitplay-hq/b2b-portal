import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderEmailOrderIdPurposeCompoundUniqueInputObjectSchema as OrderEmailOrderIdPurposeCompoundUniqueInputObjectSchema } from './OrderEmailOrderIdPurposeCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  orderId_purpose: z.lazy(() => OrderEmailOrderIdPurposeCompoundUniqueInputObjectSchema).optional()
}).strict();
export const OrderEmailWhereUniqueInputObjectSchema: z.ZodType<Prisma.OrderEmailWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderEmailWhereUniqueInput>;
export const OrderEmailWhereUniqueInputObjectZodSchema = makeSchema();
