import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const systempermissionscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => SystemPermissionScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => SystemPermissionScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SystemPermissionScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SystemPermissionScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => SystemPermissionScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  resource: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string().max(50)]).optional(),
  action: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string().max(20)]).optional(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string().max(255)]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const SystemPermissionScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.SystemPermissionScalarWhereWithAggregatesInput> = systempermissionscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.SystemPermissionScalarWhereWithAggregatesInput>;
export const SystemPermissionScalarWhereWithAggregatesInputObjectZodSchema = systempermissionscalarwherewithaggregatesinputSchema;
