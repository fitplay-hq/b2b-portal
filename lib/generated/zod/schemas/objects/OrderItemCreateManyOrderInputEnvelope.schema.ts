import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderItemCreateManyOrderInputObjectSchema as OrderItemCreateManyOrderInputObjectSchema } from './OrderItemCreateManyOrderInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => OrderItemCreateManyOrderInputObjectSchema), z.lazy(() => OrderItemCreateManyOrderInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const OrderItemCreateManyOrderInputEnvelopeObjectSchema: z.ZodType<Prisma.OrderItemCreateManyOrderInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateManyOrderInputEnvelope>;
export const OrderItemCreateManyOrderInputEnvelopeObjectZodSchema = makeSchema();
