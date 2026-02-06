import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { ProductOrderByRelationAggregateInputObjectSchema as ProductOrderByRelationAggregateInputObjectSchema } from './ProductOrderByRelationAggregateInput.schema';
import { ClientOrderByRelationAggregateInputObjectSchema as ClientOrderByRelationAggregateInputObjectSchema } from './ClientOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  address: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  products: z.lazy(() => ProductOrderByRelationAggregateInputObjectSchema).optional(),
  clients: z.lazy(() => ClientOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const CompanyOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.CompanyOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyOrderByWithRelationInput>;
export const CompanyOrderByWithRelationInputObjectZodSchema = makeSchema();
