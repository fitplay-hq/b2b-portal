import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderItemCreateManyProductInputObjectSchema as OrderItemCreateManyProductInputObjectSchema } from './OrderItemCreateManyProductInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => OrderItemCreateManyProductInputObjectSchema), z.lazy(() => OrderItemCreateManyProductInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const OrderItemCreateManyProductInputEnvelopeObjectSchema: z.ZodType<Prisma.OrderItemCreateManyProductInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateManyProductInputEnvelope>;
export const OrderItemCreateManyProductInputEnvelopeObjectZodSchema = makeSchema();
