import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumRoleNullableWithAggregatesFilterObjectSchema as EnumRoleNullableWithAggregatesFilterObjectSchema } from './EnumRoleNullableWithAggregatesFilter.schema';
import { RoleSchema } from '../enums/Role.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const adminscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => AdminScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AdminScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AdminScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AdminScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AdminScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  email: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  password: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  role: z.union([z.lazy(() => EnumRoleNullableWithAggregatesFilterObjectSchema), RoleSchema]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const AdminScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.AdminScalarWhereWithAggregatesInput> = adminscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.AdminScalarWhereWithAggregatesInput>;
export const AdminScalarWhereWithAggregatesInputObjectZodSchema = adminscalarwherewithaggregatesinputSchema;
