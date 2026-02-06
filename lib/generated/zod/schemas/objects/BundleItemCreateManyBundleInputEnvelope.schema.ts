import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemCreateManyBundleInputObjectSchema as BundleItemCreateManyBundleInputObjectSchema } from './BundleItemCreateManyBundleInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => BundleItemCreateManyBundleInputObjectSchema), z.lazy(() => BundleItemCreateManyBundleInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const BundleItemCreateManyBundleInputEnvelopeObjectSchema: z.ZodType<Prisma.BundleItemCreateManyBundleInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemCreateManyBundleInputEnvelope>;
export const BundleItemCreateManyBundleInputEnvelopeObjectZodSchema = makeSchema();
