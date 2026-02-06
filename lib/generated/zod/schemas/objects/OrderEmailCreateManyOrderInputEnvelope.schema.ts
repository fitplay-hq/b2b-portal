import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderEmailCreateManyOrderInputObjectSchema as OrderEmailCreateManyOrderInputObjectSchema } from './OrderEmailCreateManyOrderInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => OrderEmailCreateManyOrderInputObjectSchema), z.lazy(() => OrderEmailCreateManyOrderInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const OrderEmailCreateManyOrderInputEnvelopeObjectSchema: z.ZodType<Prisma.OrderEmailCreateManyOrderInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.OrderEmailCreateManyOrderInputEnvelope>;
export const OrderEmailCreateManyOrderInputEnvelopeObjectZodSchema = makeSchema();
