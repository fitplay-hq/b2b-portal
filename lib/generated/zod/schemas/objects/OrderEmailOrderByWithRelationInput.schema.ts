import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { OrderOrderByWithRelationInputObjectSchema as OrderOrderByWithRelationInputObjectSchema } from './OrderOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  orderId: SortOrderSchema.optional(),
  purpose: SortOrderSchema.optional(),
  isSent: SortOrderSchema.optional(),
  sentAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  order: z.lazy(() => OrderOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const OrderEmailOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.OrderEmailOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderEmailOrderByWithRelationInput>;
export const OrderEmailOrderByWithRelationInputObjectZodSchema = makeSchema();
