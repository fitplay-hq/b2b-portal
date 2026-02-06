import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './objects/OrderWhereInput.schema';

export const OrderDeleteManySchema: z.ZodType<Prisma.OrderDeleteManyArgs> = z.object({ where: OrderWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.OrderDeleteManyArgs>;

export const OrderDeleteManyZodSchema = z.object({ where: OrderWhereInputObjectSchema.optional() }).strict();