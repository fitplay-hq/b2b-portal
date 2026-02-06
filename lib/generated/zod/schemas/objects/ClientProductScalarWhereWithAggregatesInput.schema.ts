import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const clientproductscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => ClientProductScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ClientProductScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ClientProductScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ClientProductScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ClientProductScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  clientId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const ClientProductScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.ClientProductScalarWhereWithAggregatesInput> = clientproductscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.ClientProductScalarWhereWithAggregatesInput>;
export const ClientProductScalarWhereWithAggregatesInputObjectZodSchema = clientproductscalarwherewithaggregatesinputSchema;
