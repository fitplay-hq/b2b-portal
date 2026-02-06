import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  identifier: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  token: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  userType: SortOrderSchema.optional(),
  expires: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const ResetTokenCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ResetTokenCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ResetTokenCountOrderByAggregateInput>;
export const ResetTokenCountOrderByAggregateInputObjectZodSchema = makeSchema();
