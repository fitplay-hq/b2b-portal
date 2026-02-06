import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  clientId: z.string(),
  productId: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();
export const ClientProductUncheckedCreateInputObjectSchema: z.ZodType<Prisma.ClientProductUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductUncheckedCreateInput>;
export const ClientProductUncheckedCreateInputObjectZodSchema = makeSchema();
