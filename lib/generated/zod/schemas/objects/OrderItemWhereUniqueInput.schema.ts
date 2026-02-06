import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const OrderItemWhereUniqueInputObjectSchema: z.ZodType<Prisma.OrderItemWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemWhereUniqueInput>;
export const OrderItemWhereUniqueInputObjectZodSchema = makeSchema();
