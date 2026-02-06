import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemCreateManyBundleInputObjectSchema as BundleOrderItemCreateManyBundleInputObjectSchema } from './BundleOrderItemCreateManyBundleInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => BundleOrderItemCreateManyBundleInputObjectSchema), z.lazy(() => BundleOrderItemCreateManyBundleInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const BundleOrderItemCreateManyBundleInputEnvelopeObjectSchema: z.ZodType<Prisma.BundleOrderItemCreateManyBundleInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemCreateManyBundleInputEnvelope>;
export const BundleOrderItemCreateManyBundleInputEnvelopeObjectZodSchema = makeSchema();
