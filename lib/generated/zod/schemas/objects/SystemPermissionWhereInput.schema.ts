import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { SystemRoleListRelationFilterObjectSchema as SystemRoleListRelationFilterObjectSchema } from './SystemRoleListRelationFilter.schema'

const systempermissionwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => SystemPermissionWhereInputObjectSchema), z.lazy(() => SystemPermissionWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SystemPermissionWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SystemPermissionWhereInputObjectSchema), z.lazy(() => SystemPermissionWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  resource: z.union([z.lazy(() => StringFilterObjectSchema), z.string().max(50)]).optional(),
  action: z.union([z.lazy(() => StringFilterObjectSchema), z.string().max(20)]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string().max(255)]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  roles: z.lazy(() => SystemRoleListRelationFilterObjectSchema).optional()
}).strict();
export const SystemPermissionWhereInputObjectSchema: z.ZodType<Prisma.SystemPermissionWhereInput> = systempermissionwhereinputSchema as unknown as z.ZodType<Prisma.SystemPermissionWhereInput>;
export const SystemPermissionWhereInputObjectZodSchema = systempermissionwhereinputSchema;
