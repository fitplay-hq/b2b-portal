import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  clientId: z.string(),
  productId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const ClientProductCreateManyInputObjectSchema: z.ZodType<Prisma.ClientProductCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductCreateManyInput>;
export const ClientProductCreateManyInputObjectZodSchema = makeSchema();
