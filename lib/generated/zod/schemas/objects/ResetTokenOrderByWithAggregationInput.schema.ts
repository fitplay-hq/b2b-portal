import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ResetTokenCountOrderByAggregateInputObjectSchema as ResetTokenCountOrderByAggregateInputObjectSchema } from './ResetTokenCountOrderByAggregateInput.schema';
import { ResetTokenMaxOrderByAggregateInputObjectSchema as ResetTokenMaxOrderByAggregateInputObjectSchema } from './ResetTokenMaxOrderByAggregateInput.schema';
import { ResetTokenMinOrderByAggregateInputObjectSchema as ResetTokenMinOrderByAggregateInputObjectSchema } from './ResetTokenMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  identifier: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  token: SortOrderSchema.optional(),
  userId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  userType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  expires: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  _count: z.lazy(() => ResetTokenCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ResetTokenMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ResetTokenMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ResetTokenOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ResetTokenOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.ResetTokenOrderByWithAggregationInput>;
export const ResetTokenOrderByWithAggregationInputObjectZodSchema = makeSchema();
