import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './objects/OrderItemWhereInput.schema';

export const OrderItemDeleteManySchema: z.ZodType<Prisma.OrderItemDeleteManyArgs> = z.object({ where: OrderItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.OrderItemDeleteManyArgs>;

export const OrderItemDeleteManyZodSchema = z.object({ where: OrderItemWhereInputObjectSchema.optional() }).strict();