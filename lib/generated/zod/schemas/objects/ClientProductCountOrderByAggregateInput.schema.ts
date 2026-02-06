import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  clientId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const ClientProductCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ClientProductCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductCountOrderByAggregateInput>;
export const ClientProductCountOrderByAggregateInputObjectZodSchema = makeSchema();
