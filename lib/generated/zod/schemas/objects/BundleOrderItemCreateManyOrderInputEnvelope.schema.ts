import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemCreateManyOrderInputObjectSchema as BundleOrderItemCreateManyOrderInputObjectSchema } from './BundleOrderItemCreateManyOrderInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => BundleOrderItemCreateManyOrderInputObjectSchema), z.lazy(() => BundleOrderItemCreateManyOrderInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const BundleOrderItemCreateManyOrderInputEnvelopeObjectSchema: z.ZodType<Prisma.BundleOrderItemCreateManyOrderInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemCreateManyOrderInputEnvelope>;
export const BundleOrderItemCreateManyOrderInputEnvelopeObjectZodSchema = makeSchema();
