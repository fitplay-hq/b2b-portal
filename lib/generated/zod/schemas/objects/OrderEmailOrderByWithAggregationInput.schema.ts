import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { OrderEmailCountOrderByAggregateInputObjectSchema as OrderEmailCountOrderByAggregateInputObjectSchema } from './OrderEmailCountOrderByAggregateInput.schema';
import { OrderEmailMaxOrderByAggregateInputObjectSchema as OrderEmailMaxOrderByAggregateInputObjectSchema } from './OrderEmailMaxOrderByAggregateInput.schema';
import { OrderEmailMinOrderByAggregateInputObjectSchema as OrderEmailMinOrderByAggregateInputObjectSchema } from './OrderEmailMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  orderId: SortOrderSchema.optional(),
  purpose: SortOrderSchema.optional(),
  isSent: SortOrderSchema.optional(),
  sentAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => OrderEmailCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => OrderEmailMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => OrderEmailMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const OrderEmailOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.OrderEmailOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderEmailOrderByWithAggregationInput>;
export const OrderEmailOrderByWithAggregationInputObjectZodSchema = makeSchema();
