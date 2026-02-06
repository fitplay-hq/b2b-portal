import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumRoleNullableWithAggregatesFilterObjectSchema as EnumRoleNullableWithAggregatesFilterObjectSchema } from './EnumRoleNullableWithAggregatesFilter.schema';
import { RoleSchema } from '../enums/Role.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const resettokenscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => ResetTokenScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ResetTokenScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ResetTokenScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ResetTokenScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ResetTokenScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  identifier: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  password: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  token: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  userType: z.union([z.lazy(() => EnumRoleNullableWithAggregatesFilterObjectSchema), RoleSchema]).optional().nullable(),
  expires: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const ResetTokenScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.ResetTokenScalarWhereWithAggregatesInput> = resettokenscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.ResetTokenScalarWhereWithAggregatesInput>;
export const ResetTokenScalarWhereWithAggregatesInputObjectZodSchema = resettokenscalarwherewithaggregatesinputSchema;
