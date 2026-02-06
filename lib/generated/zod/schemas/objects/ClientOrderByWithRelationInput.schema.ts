import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { CompanyOrderByWithRelationInputObjectSchema as CompanyOrderByWithRelationInputObjectSchema } from './CompanyOrderByWithRelationInput.schema';
import { OrderOrderByRelationAggregateInputObjectSchema as OrderOrderByRelationAggregateInputObjectSchema } from './OrderOrderByRelationAggregateInput.schema';
import { ClientProductOrderByRelationAggregateInputObjectSchema as ClientProductOrderByRelationAggregateInputObjectSchema } from './ClientProductOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  phone: SortOrderSchema.optional(),
  companyID: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  companyName: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isShowPrice: SortOrderSchema.optional(),
  address: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  company: z.lazy(() => CompanyOrderByWithRelationInputObjectSchema).optional(),
  orders: z.lazy(() => OrderOrderByRelationAggregateInputObjectSchema).optional(),
  products: z.lazy(() => ClientProductOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const ClientOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ClientOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientOrderByWithRelationInput>;
export const ClientOrderByWithRelationInputObjectZodSchema = makeSchema();
