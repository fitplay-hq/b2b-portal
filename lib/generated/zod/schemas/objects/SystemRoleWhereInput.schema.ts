import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { SystemPermissionListRelationFilterObjectSchema as SystemPermissionListRelationFilterObjectSchema } from './SystemPermissionListRelationFilter.schema';
import { SystemUserListRelationFilterObjectSchema as SystemUserListRelationFilterObjectSchema } from './SystemUserListRelationFilter.schema'

const systemrolewhereinputSchema = z.object({
  AND: z.union([z.lazy(() => SystemRoleWhereInputObjectSchema), z.lazy(() => SystemRoleWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SystemRoleWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SystemRoleWhereInputObjectSchema), z.lazy(() => SystemRoleWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string().max(50)]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string().max(255)]).optional().nullable(),
  isActive: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  permissions: z.lazy(() => SystemPermissionListRelationFilterObjectSchema).optional(),
  users: z.lazy(() => SystemUserListRelationFilterObjectSchema).optional()
}).strict();
export const SystemRoleWhereInputObjectSchema: z.ZodType<Prisma.SystemRoleWhereInput> = systemrolewhereinputSchema as unknown as z.ZodType<Prisma.SystemRoleWhereInput>;
export const SystemRoleWhereInputObjectZodSchema = systemrolewhereinputSchema;
