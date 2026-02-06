import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumRoleNullableFilterObjectSchema as EnumRoleNullableFilterObjectSchema } from './EnumRoleNullableFilter.schema';
import { RoleSchema } from '../enums/Role.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const adminwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => AdminWhereInputObjectSchema), z.lazy(() => AdminWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AdminWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AdminWhereInputObjectSchema), z.lazy(() => AdminWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  email: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  password: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  role: z.union([z.lazy(() => EnumRoleNullableFilterObjectSchema), RoleSchema]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const AdminWhereInputObjectSchema: z.ZodType<Prisma.AdminWhereInput> = adminwhereinputSchema as unknown as z.ZodType<Prisma.AdminWhereInput>;
export const AdminWhereInputObjectZodSchema = adminwhereinputSchema;
