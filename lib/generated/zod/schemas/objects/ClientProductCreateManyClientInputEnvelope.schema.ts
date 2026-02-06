import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientProductCreateManyClientInputObjectSchema as ClientProductCreateManyClientInputObjectSchema } from './ClientProductCreateManyClientInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ClientProductCreateManyClientInputObjectSchema), z.lazy(() => ClientProductCreateManyClientInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ClientProductCreateManyClientInputEnvelopeObjectSchema: z.ZodType<Prisma.ClientProductCreateManyClientInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductCreateManyClientInputEnvelope>;
export const ClientProductCreateManyClientInputEnvelopeObjectZodSchema = makeSchema();
