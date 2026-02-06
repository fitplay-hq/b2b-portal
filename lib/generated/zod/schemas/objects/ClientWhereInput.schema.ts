import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { EnumRoleFilterObjectSchema as EnumRoleFilterObjectSchema } from './EnumRoleFilter.schema';
import { RoleSchema } from '../enums/Role.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { CompanyNullableScalarRelationFilterObjectSchema as CompanyNullableScalarRelationFilterObjectSchema } from './CompanyNullableScalarRelationFilter.schema';
import { CompanyWhereInputObjectSchema as CompanyWhereInputObjectSchema } from './CompanyWhereInput.schema';
import { OrderListRelationFilterObjectSchema as OrderListRelationFilterObjectSchema } from './OrderListRelationFilter.schema';
import { ClientProductListRelationFilterObjectSchema as ClientProductListRelationFilterObjectSchema } from './ClientProductListRelationFilter.schema'

const clientwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ClientWhereInputObjectSchema), z.lazy(() => ClientWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ClientWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ClientWhereInputObjectSchema), z.lazy(() => ClientWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string().max(50)]).optional(),
  email: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  password: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  phone: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  companyID: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  companyName: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  isShowPrice: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  address: z.union([z.lazy(() => StringFilterObjectSchema), z.string().max(100)]).optional(),
  role: z.union([z.lazy(() => EnumRoleFilterObjectSchema), RoleSchema]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  company: z.union([z.lazy(() => CompanyNullableScalarRelationFilterObjectSchema), z.lazy(() => CompanyWhereInputObjectSchema)]).optional(),
  orders: z.lazy(() => OrderListRelationFilterObjectSchema).optional(),
  products: z.lazy(() => ClientProductListRelationFilterObjectSchema).optional()
}).strict();
export const ClientWhereInputObjectSchema: z.ZodType<Prisma.ClientWhereInput> = clientwhereinputSchema as unknown as z.ZodType<Prisma.ClientWhereInput>;
export const ClientWhereInputObjectZodSchema = clientwhereinputSchema;
