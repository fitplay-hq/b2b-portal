import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const systemuserscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => SystemUserScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => SystemUserScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SystemUserScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SystemUserScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => SystemUserScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string().max(100)]).optional(),
  email: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  password: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  isActive: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  roleId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const SystemUserScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.SystemUserScalarWhereWithAggregatesInput> = systemuserscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.SystemUserScalarWhereWithAggregatesInput>;
export const SystemUserScalarWhereWithAggregatesInputObjectZodSchema = systemuserscalarwherewithaggregatesinputSchema;
