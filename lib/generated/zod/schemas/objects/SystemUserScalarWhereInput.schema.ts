import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const systemuserscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => SystemUserScalarWhereInputObjectSchema), z.lazy(() => SystemUserScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SystemUserScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SystemUserScalarWhereInputObjectSchema), z.lazy(() => SystemUserScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  email: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  password: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  isActive: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  roleId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const SystemUserScalarWhereInputObjectSchema: z.ZodType<Prisma.SystemUserScalarWhereInput> = systemuserscalarwhereinputSchema as unknown as z.ZodType<Prisma.SystemUserScalarWhereInput>;
export const SystemUserScalarWhereInputObjectZodSchema = systemuserscalarwhereinputSchema;
