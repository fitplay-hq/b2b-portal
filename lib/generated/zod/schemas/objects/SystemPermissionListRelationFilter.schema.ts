import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemPermissionWhereInputObjectSchema as SystemPermissionWhereInputObjectSchema } from './SystemPermissionWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => SystemPermissionWhereInputObjectSchema).optional(),
  some: z.lazy(() => SystemPermissionWhereInputObjectSchema).optional(),
  none: z.lazy(() => SystemPermissionWhereInputObjectSchema).optional()
}).strict();
export const SystemPermissionListRelationFilterObjectSchema: z.ZodType<Prisma.SystemPermissionListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionListRelationFilter>;
export const SystemPermissionListRelationFilterObjectZodSchema = makeSchema();
