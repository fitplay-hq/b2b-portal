import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ProductListRelationFilterObjectSchema as ProductListRelationFilterObjectSchema } from './ProductListRelationFilter.schema';
import { ClientListRelationFilterObjectSchema as ClientListRelationFilterObjectSchema } from './ClientListRelationFilter.schema'

const companywhereinputSchema = z.object({
  AND: z.union([z.lazy(() => CompanyWhereInputObjectSchema), z.lazy(() => CompanyWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CompanyWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CompanyWhereInputObjectSchema), z.lazy(() => CompanyWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string().max(50)]).optional(),
  address: z.union([z.lazy(() => StringFilterObjectSchema), z.string().max(100)]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  products: z.lazy(() => ProductListRelationFilterObjectSchema).optional(),
  clients: z.lazy(() => ClientListRelationFilterObjectSchema).optional()
}).strict();
export const CompanyWhereInputObjectSchema: z.ZodType<Prisma.CompanyWhereInput> = companywhereinputSchema as unknown as z.ZodType<Prisma.CompanyWhereInput>;
export const CompanyWhereInputObjectZodSchema = companywhereinputSchema;
