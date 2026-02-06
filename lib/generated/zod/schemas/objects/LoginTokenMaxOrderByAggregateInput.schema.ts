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
export const LoginTokenMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.LoginTokenMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.LoginTokenMaxOrderByAggregateInput>;
export const LoginTokenMaxOrderByAggregateInputObjectZodSchema = makeSchema();
