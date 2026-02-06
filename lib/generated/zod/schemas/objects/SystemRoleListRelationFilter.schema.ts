import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleWhereInputObjectSchema as SystemRoleWhereInputObjectSchema } from './SystemRoleWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => SystemRoleWhereInputObjectSchema).optional(),
  some: z.lazy(() => SystemRoleWhereInputObjectSchema).optional(),
  none: z.lazy(() => SystemRoleWhereInputObjectSchema).optional()
}).strict();
export const SystemRoleListRelationFilterObjectSchema: z.ZodType<Prisma.SystemRoleListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleListRelationFilter>;
export const SystemRoleListRelationFilterObjectZodSchema = makeSchema();
