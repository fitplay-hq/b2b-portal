import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { EnumRoleWithAggregatesFilterObjectSchema as EnumRoleWithAggregatesFilterObjectSchema } from './EnumRoleWithAggregatesFilter.schema';
import { RoleSchema } from '../enums/Role.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const clientscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => ClientScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ClientScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ClientScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ClientScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ClientScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string().max(50)]).optional(),
  email: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  password: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  phone: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  companyID: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  companyName: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  isShowPrice: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  address: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string().max(100)]).optional(),
  role: z.union([z.lazy(() => EnumRoleWithAggregatesFilterObjectSchema), RoleSchema]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const ClientScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.ClientScalarWhereWithAggregatesInput> = clientscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.ClientScalarWhereWithAggregatesInput>;
export const ClientScalarWhereWithAggregatesInputObjectZodSchema = clientscalarwherewithaggregatesinputSchema;
