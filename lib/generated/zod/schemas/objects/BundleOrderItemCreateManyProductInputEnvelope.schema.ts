import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemCreateManyProductInputObjectSchema as BundleOrderItemCreateManyProductInputObjectSchema } from './BundleOrderItemCreateManyProductInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => BundleOrderItemCreateManyProductInputObjectSchema), z.lazy(() => BundleOrderItemCreateManyProductInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const BundleOrderItemCreateManyProductInputEnvelopeObjectSchema: z.ZodType<Prisma.BundleOrderItemCreateManyProductInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemCreateManyProductInputEnvelope>;
export const BundleOrderItemCreateManyProductInputEnvelopeObjectZodSchema = makeSchema();
