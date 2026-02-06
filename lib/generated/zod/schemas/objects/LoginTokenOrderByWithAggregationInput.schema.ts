import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { LoginTokenCountOrderByAggregateInputObjectSchema as LoginTokenCountOrderByAggregateInputObjectSchema } from './LoginTokenCountOrderByAggregateInput.schema';
import { LoginTokenMaxOrderByAggregateInputObjectSchema as LoginTokenMaxOrderByAggregateInputObjectSchema } from './LoginTokenMaxOrderByAggregateInput.schema';
import { LoginTokenMinOrderByAggregateInputObjectSchema as LoginTokenMinOrderByAggregateInputObjectSchema } from './LoginTokenMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  token: SortOrderSchema.optional(),
  identifier: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  userId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  userType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  expires: SortOrderSchema.optional(),
  _count: z.lazy(() => LoginTokenCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => LoginTokenMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => LoginTokenMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const LoginTokenOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.LoginTokenOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.LoginTokenOrderByWithAggregationInput>;
export const LoginTokenOrderByWithAggregationInputObjectZodSchema = makeSchema();
