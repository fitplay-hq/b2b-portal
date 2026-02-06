import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { ClientProductCountOrderByAggregateInputObjectSchema as ClientProductCountOrderByAggregateInputObjectSchema } from './ClientProductCountOrderByAggregateInput.schema';
import { ClientProductMaxOrderByAggregateInputObjectSchema as ClientProductMaxOrderByAggregateInputObjectSchema } from './ClientProductMaxOrderByAggregateInput.schema';
import { ClientProductMinOrderByAggregateInputObjectSchema as ClientProductMinOrderByAggregateInputObjectSchema } from './ClientProductMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  clientId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => ClientProductCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ClientProductMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ClientProductMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ClientProductOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ClientProductOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductOrderByWithAggregationInput>;
export const ClientProductOrderByWithAggregationInputObjectZodSchema = makeSchema();
