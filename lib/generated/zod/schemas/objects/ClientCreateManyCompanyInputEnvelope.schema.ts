import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientCreateManyCompanyInputObjectSchema as ClientCreateManyCompanyInputObjectSchema } from './ClientCreateManyCompanyInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ClientCreateManyCompanyInputObjectSchema), z.lazy(() => ClientCreateManyCompanyInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ClientCreateManyCompanyInputEnvelopeObjectSchema: z.ZodType<Prisma.ClientCreateManyCompanyInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ClientCreateManyCompanyInputEnvelope>;
export const ClientCreateManyCompanyInputEnvelopeObjectZodSchema = makeSchema();
