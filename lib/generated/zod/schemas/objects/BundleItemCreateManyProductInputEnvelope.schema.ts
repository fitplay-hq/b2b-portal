import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemCreateManyProductInputObjectSchema as BundleItemCreateManyProductInputObjectSchema } from './BundleItemCreateManyProductInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => BundleItemCreateManyProductInputObjectSchema), z.lazy(() => BundleItemCreateManyProductInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const BundleItemCreateManyProductInputEnvelopeObjectSchema: z.ZodType<Prisma.BundleItemCreateManyProductInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemCreateManyProductInputEnvelope>;
export const BundleItemCreateManyProductInputEnvelopeObjectZodSchema = makeSchema();
