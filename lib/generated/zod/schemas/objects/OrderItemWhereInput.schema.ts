import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { FloatFilterObjectSchema as FloatFilterObjectSchema } from './FloatFilter.schema';
import { OrderScalarRelationFilterObjectSchema as OrderScalarRelationFilterObjectSchema } from './OrderScalarRelationFilter.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { ProductScalarRelationFilterObjectSchema as ProductScalarRelationFilterObjectSchema } from './ProductScalarRelationFilter.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const orderitemwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => OrderItemWhereInputObjectSchema), z.lazy(() => OrderItemWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => OrderItemWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => OrderItemWhereInputObjectSchema), z.lazy(() => OrderItemWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  orderId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  quantity: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  price: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  order: z.union([z.lazy(() => OrderScalarRelationFilterObjectSchema), z.lazy(() => OrderWhereInputObjectSchema)]).optional(),
  product: z.union([z.lazy(() => ProductScalarRelationFilterObjectSchema), z.lazy(() => ProductWhereInputObjectSchema)]).optional()
}).strict();
export const OrderItemWhereInputObjectSchema: z.ZodType<Prisma.OrderItemWhereInput> = orderitemwhereinputSchema as unknown as z.ZodType<Prisma.OrderItemWhereInput>;
export const OrderItemWhereInputObjectZodSchema = orderitemwhereinputSchema;
