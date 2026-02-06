import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderCreateManyClientInputObjectSchema as OrderCreateManyClientInputObjectSchema } from './OrderCreateManyClientInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => OrderCreateManyClientInputObjectSchema), z.lazy(() => OrderCreateManyClientInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const OrderCreateManyClientInputEnvelopeObjectSchema: z.ZodType<Prisma.OrderCreateManyClientInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateManyClientInputEnvelope>;
export const OrderCreateManyClientInputEnvelopeObjectZodSchema = makeSchema();
