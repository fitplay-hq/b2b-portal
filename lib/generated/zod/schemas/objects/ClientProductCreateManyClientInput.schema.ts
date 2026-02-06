import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  productId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const ClientProductCreateManyClientInputObjectSchema: z.ZodType<Prisma.ClientProductCreateManyClientInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductCreateManyClientInput>;
export const ClientProductCreateManyClientInputObjectZodSchema = makeSchema();
