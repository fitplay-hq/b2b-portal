import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const systempermissionscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => SystemPermissionScalarWhereInputObjectSchema), z.lazy(() => SystemPermissionScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SystemPermissionScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SystemPermissionScalarWhereInputObjectSchema), z.lazy(() => SystemPermissionScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  resource: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  action: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const SystemPermissionScalarWhereInputObjectSchema: z.ZodType<Prisma.SystemPermissionScalarWhereInput> = systempermissionscalarwhereinputSchema as unknown as z.ZodType<Prisma.SystemPermissionScalarWhereInput>;
export const SystemPermissionScalarWhereInputObjectZodSchema = systempermissionscalarwhereinputSchema;
