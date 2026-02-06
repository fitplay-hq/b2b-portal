import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const companyscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => CompanyScalarWhereInputObjectSchema), z.lazy(() => CompanyScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CompanyScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CompanyScalarWhereInputObjectSchema), z.lazy(() => CompanyScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  address: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const CompanyScalarWhereInputObjectSchema: z.ZodType<Prisma.CompanyScalarWhereInput> = companyscalarwhereinputSchema as unknown as z.ZodType<Prisma.CompanyScalarWhereInput>;
export const CompanyScalarWhereInputObjectZodSchema = companyscalarwhereinputSchema;
