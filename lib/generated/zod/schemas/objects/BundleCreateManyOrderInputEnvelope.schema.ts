import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleCreateManyOrderInputObjectSchema as BundleCreateManyOrderInputObjectSchema } from './BundleCreateManyOrderInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => BundleCreateManyOrderInputObjectSchema), z.lazy(() => BundleCreateManyOrderInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const BundleCreateManyOrderInputEnvelopeObjectSchema: z.ZodType<Prisma.BundleCreateManyOrderInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.BundleCreateManyOrderInputEnvelope>;
export const BundleCreateManyOrderInputEnvelopeObjectZodSchema = makeSchema();
