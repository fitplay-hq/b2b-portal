import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  token: SortOrderSchema.optional(),
  identifier: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  userType: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  expires: SortOrderSchema.optional()
}).strict();
export const LoginTokenCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.LoginTokenCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.LoginTokenCountOrderByAggregateInput>;
export const LoginTokenCountOrderByAggregateInputObjectZodSchema = makeSchema();
