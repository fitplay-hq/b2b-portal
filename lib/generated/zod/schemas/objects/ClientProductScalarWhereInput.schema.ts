import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const clientproductscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ClientProductScalarWhereInputObjectSchema), z.lazy(() => ClientProductScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ClientProductScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ClientProductScalarWhereInputObjectSchema), z.lazy(() => ClientProductScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  clientId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const ClientProductScalarWhereInputObjectSchema: z.ZodType<Prisma.ClientProductScalarWhereInput> = clientproductscalarwhereinputSchema as unknown as z.ZodType<Prisma.ClientProductScalarWhereInput>;
export const ClientProductScalarWhereInputObjectZodSchema = clientproductscalarwhereinputSchema;
