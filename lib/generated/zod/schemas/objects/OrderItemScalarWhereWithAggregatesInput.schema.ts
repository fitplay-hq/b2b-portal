import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { FloatWithAggregatesFilterObjectSchema as FloatWithAggregatesFilterObjectSchema } from './FloatWithAggregatesFilter.schema'

const orderitemscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => OrderItemScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => OrderItemScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => OrderItemScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => OrderItemScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => OrderItemScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  orderId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  quantity: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  price: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional()
}).strict();
export const OrderItemScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.OrderItemScalarWhereWithAggregatesInput> = orderitemscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.OrderItemScalarWhereWithAggregatesInput>;
export const OrderItemScalarWhereWithAggregatesInputObjectZodSchema = orderitemscalarwherewithaggregatesinputSchema;
