import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemUserWhereInputObjectSchema as SystemUserWhereInputObjectSchema } from './SystemUserWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => SystemUserWhereInputObjectSchema).optional(),
  some: z.lazy(() => SystemUserWhereInputObjectSchema).optional(),
  none: z.lazy(() => SystemUserWhereInputObjectSchema).optional()
}).strict();
export const SystemUserListRelationFilterObjectSchema: z.ZodType<Prisma.SystemUserListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.SystemUserListRelationFilter>;
export const SystemUserListRelationFilterObjectZodSchema = makeSchema();
