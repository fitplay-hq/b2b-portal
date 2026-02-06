import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  orderId: z.string(),
  quantity: z.number().int().optional(),
  price: z.number()
}).strict();
export const OrderItemCreateManyProductInputObjectSchema: z.ZodType<Prisma.OrderItemCreateManyProductInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateManyProductInput>;
export const OrderItemCreateManyProductInputObjectZodSchema = makeSchema();
