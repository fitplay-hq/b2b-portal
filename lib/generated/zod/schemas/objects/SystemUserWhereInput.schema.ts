import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { SystemRoleScalarRelationFilterObjectSchema as SystemRoleScalarRelationFilterObjectSchema } from './SystemRoleScalarRelationFilter.schema';
import { SystemRoleWhereInputObjectSchema as SystemRoleWhereInputObjectSchema } from './SystemRoleWhereInput.schema'

const systemuserwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => SystemUserWhereInputObjectSchema), z.lazy(() => SystemUserWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SystemUserWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SystemUserWhereInputObjectSchema), z.lazy(() => SystemUserWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string().max(100)]).optional(),
  email: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  password: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  isActive: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  roleId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  role: z.union([z.lazy(() => SystemRoleScalarRelationFilterObjectSchema), z.lazy(() => SystemRoleWhereInputObjectSchema)]).optional()
}).strict();
export const SystemUserWhereInputObjectSchema: z.ZodType<Prisma.SystemUserWhereInput> = systemuserwhereinputSchema as unknown as z.ZodType<Prisma.SystemUserWhereInput>;
export const SystemUserWhereInputObjectZodSchema = systemuserwhereinputSchema;
