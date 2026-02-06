import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumRoleNullableFilterObjectSchema as EnumRoleNullableFilterObjectSchema } from './EnumRoleNullableFilter.schema';
import { RoleSchema } from '../enums/Role.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const logintokenwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => LoginTokenWhereInputObjectSchema), z.lazy(() => LoginTokenWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => LoginTokenWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => LoginTokenWhereInputObjectSchema), z.lazy(() => LoginTokenWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  token: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  identifier: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  password: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  userType: z.union([z.lazy(() => EnumRoleNullableFilterObjectSchema), RoleSchema]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  expires: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const LoginTokenWhereInputObjectSchema: z.ZodType<Prisma.LoginTokenWhereInput> = logintokenwhereinputSchema as unknown as z.ZodType<Prisma.LoginTokenWhereInput>;
export const LoginTokenWhereInputObjectZodSchema = logintokenwhereinputSchema;
