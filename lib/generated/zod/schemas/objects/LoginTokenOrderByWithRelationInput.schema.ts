import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  token: SortOrderSchema.optional(),
  identifier: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  userId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  userType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  expires: SortOrderSchema.optional()
}).strict();
export const LoginTokenOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.LoginTokenOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.LoginTokenOrderByWithRelationInput>;
export const LoginTokenOrderByWithRelationInputObjectZodSchema = makeSchema();
