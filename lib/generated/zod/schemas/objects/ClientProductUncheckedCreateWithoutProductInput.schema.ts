import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  clientId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const ClientProductUncheckedCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.ClientProductUncheckedCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductUncheckedCreateWithoutProductInput>;
export const ClientProductUncheckedCreateWithoutProductInputObjectZodSchema = makeSchema();
