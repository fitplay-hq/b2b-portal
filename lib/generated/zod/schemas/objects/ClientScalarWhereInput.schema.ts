import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { EnumRoleFilterObjectSchema as EnumRoleFilterObjectSchema } from './EnumRoleFilter.schema';
import { RoleSchema } from '../enums/Role.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const clientscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ClientScalarWhereInputObjectSchema), z.lazy(() => ClientScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ClientScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ClientScalarWhereInputObjectSchema), z.lazy(() => ClientScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  email: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  password: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  phone: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  companyID: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  companyName: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  isShowPrice: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  address: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  role: z.union([z.lazy(() => EnumRoleFilterObjectSchema), RoleSchema]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const ClientScalarWhereInputObjectSchema: z.ZodType<Prisma.ClientScalarWhereInput> = clientscalarwhereinputSchema as unknown as z.ZodType<Prisma.ClientScalarWhereInput>;
export const ClientScalarWhereInputObjectZodSchema = clientscalarwhereinputSchema;
