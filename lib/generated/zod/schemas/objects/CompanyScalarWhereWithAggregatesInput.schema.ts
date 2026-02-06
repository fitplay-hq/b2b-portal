import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const companyscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => CompanyScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CompanyScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CompanyScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CompanyScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CompanyScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string().max(50)]).optional(),
  address: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string().max(100)]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const CompanyScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.CompanyScalarWhereWithAggregatesInput> = companyscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.CompanyScalarWhereWithAggregatesInput>;
export const CompanyScalarWhereWithAggregatesInputObjectZodSchema = companyscalarwherewithaggregatesinputSchema;
