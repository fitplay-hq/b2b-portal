import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  productId: z.string(),
  quantity: z.number().int().optional(),
  price: z.number()
}).strict();
export const OrderItemCreateManyOrderInputObjectSchema: z.ZodType<Prisma.OrderItemCreateManyOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateManyOrderInput>;
export const OrderItemCreateManyOrderInputObjectZodSchema = makeSchema();
