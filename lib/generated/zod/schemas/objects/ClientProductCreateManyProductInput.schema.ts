import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  clientId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const ClientProductCreateManyProductInputObjectSchema: z.ZodType<Prisma.ClientProductCreateManyProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductCreateManyProductInput>;
export const ClientProductCreateManyProductInputObjectZodSchema = makeSchema();
