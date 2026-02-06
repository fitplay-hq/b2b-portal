import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  phone: SortOrderSchema.optional(),
  companyID: SortOrderSchema.optional(),
  companyName: SortOrderSchema.optional(),
  isShowPrice: SortOrderSchema.optional(),
  address: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const ClientMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ClientMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientMaxOrderByAggregateInput>;
export const ClientMaxOrderByAggregateInputObjectZodSchema = makeSchema();
