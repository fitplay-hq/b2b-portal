import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  identifier: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  token: SortOrderSchema.optional(),
  userId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  userType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  expires: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const ResetTokenOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.ResetTokenOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.ResetTokenOrderByWithRelationInput>;
export const ResetTokenOrderByWithRelationInputObjectZodSchema = makeSchema();
