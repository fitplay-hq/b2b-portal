import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { FloatFilterObjectSchema as FloatFilterObjectSchema } from './FloatFilter.schema'

const orderitemscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => OrderItemScalarWhereInputObjectSchema), z.lazy(() => OrderItemScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => OrderItemScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => OrderItemScalarWhereInputObjectSchema), z.lazy(() => OrderItemScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  orderId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  quantity: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  price: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional()
}).strict();
export const OrderItemScalarWhereInputObjectSchema: z.ZodType<Prisma.OrderItemScalarWhereInput> = orderitemscalarwhereinputSchema as unknown as z.ZodType<Prisma.OrderItemScalarWhereInput>;
export const OrderItemScalarWhereInputObjectZodSchema = orderitemscalarwhereinputSchema;
