import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemUserCreateManyRoleInputObjectSchema as SystemUserCreateManyRoleInputObjectSchema } from './SystemUserCreateManyRoleInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => SystemUserCreateManyRoleInputObjectSchema), z.lazy(() => SystemUserCreateManyRoleInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const SystemUserCreateManyRoleInputEnvelopeObjectSchema: z.ZodType<Prisma.SystemUserCreateManyRoleInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.SystemUserCreateManyRoleInputEnvelope>;
export const SystemUserCreateManyRoleInputEnvelopeObjectZodSchema = makeSchema();
