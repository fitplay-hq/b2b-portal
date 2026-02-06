import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { CompanyCountOrderByAggregateInputObjectSchema as CompanyCountOrderByAggregateInputObjectSchema } from './CompanyCountOrderByAggregateInput.schema';
import { CompanyMaxOrderByAggregateInputObjectSchema as CompanyMaxOrderByAggregateInputObjectSchema } from './CompanyMaxOrderByAggregateInput.schema';
import { CompanyMinOrderByAggregateInputObjectSchema as CompanyMinOrderByAggregateInputObjectSchema } from './CompanyMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  address: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => CompanyCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => CompanyMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => CompanyMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const CompanyOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.CompanyOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyOrderByWithAggregationInput>;
export const CompanyOrderByWithAggregationInputObjectZodSchema = makeSchema();
