import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const systemrolescalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => SystemRoleScalarWhereInputObjectSchema), z.lazy(() => SystemRoleScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SystemRoleScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SystemRoleScalarWhereInputObjectSchema), z.lazy(() => SystemRoleScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  isActive: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const SystemRoleScalarWhereInputObjectSchema: z.ZodType<Prisma.SystemRoleScalarWhereInput> = systemrolescalarwhereinputSchema as unknown as z.ZodType<Prisma.SystemRoleScalarWhereInput>;
export const SystemRoleScalarWhereInputObjectZodSchema = systemrolescalarwhereinputSchema;
