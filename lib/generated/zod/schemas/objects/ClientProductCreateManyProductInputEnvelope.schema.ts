import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientProductCreateManyProductInputObjectSchema as ClientProductCreateManyProductInputObjectSchema } from './ClientProductCreateManyProductInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ClientProductCreateManyProductInputObjectSchema), z.lazy(() => ClientProductCreateManyProductInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ClientProductCreateManyProductInputEnvelopeObjectSchema: z.ZodType<Prisma.ClientProductCreateManyProductInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductCreateManyProductInputEnvelope>;
export const ClientProductCreateManyProductInputEnvelopeObjectZodSchema = makeSchema();
