import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  productId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const ClientProductUncheckedCreateWithoutClientInputObjectSchema: z.ZodType<Prisma.ClientProductUncheckedCreateWithoutClientInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductUncheckedCreateWithoutClientInput>;
export const ClientProductUncheckedCreateWithoutClientInputObjectZodSchema = makeSchema();
