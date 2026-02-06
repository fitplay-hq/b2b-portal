import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ClientScalarRelationFilterObjectSchema as ClientScalarRelationFilterObjectSchema } from './ClientScalarRelationFilter.schema';
import { ClientWhereInputObjectSchema as ClientWhereInputObjectSchema } from './ClientWhereInput.schema';
import { ProductScalarRelationFilterObjectSchema as ProductScalarRelationFilterObjectSchema } from './ProductScalarRelationFilter.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const clientproductwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ClientProductWhereInputObjectSchema), z.lazy(() => ClientProductWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ClientProductWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ClientProductWhereInputObjectSchema), z.lazy(() => ClientProductWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  clientId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  client: z.union([z.lazy(() => ClientScalarRelationFilterObjectSchema), z.lazy(() => ClientWhereInputObjectSchema)]).optional(),
  product: z.union([z.lazy(() => ProductScalarRelationFilterObjectSchema), z.lazy(() => ProductWhereInputObjectSchema)]).optional()
}).strict();
export const ClientProductWhereInputObjectSchema: z.ZodType<Prisma.ClientProductWhereInput> = clientproductwhereinputSchema as unknown as z.ZodType<Prisma.ClientProductWhereInput>;
export const ClientProductWhereInputObjectZodSchema = clientproductwhereinputSchema;
