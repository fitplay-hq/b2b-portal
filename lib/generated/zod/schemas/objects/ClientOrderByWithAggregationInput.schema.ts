import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ClientCountOrderByAggregateInputObjectSchema as ClientCountOrderByAggregateInputObjectSchema } from './ClientCountOrderByAggregateInput.schema';
import { ClientMaxOrderByAggregateInputObjectSchema as ClientMaxOrderByAggregateInputObjectSchema } from './ClientMaxOrderByAggregateInput.schema';
import { ClientMinOrderByAggregateInputObjectSchema as ClientMinOrderByAggregateInputObjectSchema } from './ClientMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  phone: SortOrderSchema.optional(),
  companyID: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  companyName: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isShowPrice: SortOrderSchema.optional(),
  address: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => ClientCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ClientMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ClientMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ClientOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ClientOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientOrderByWithAggregationInput>;
export const ClientOrderByWithAggregationInputObjectZodSchema = makeSchema();
