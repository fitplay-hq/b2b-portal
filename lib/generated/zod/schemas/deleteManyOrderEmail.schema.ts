import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderEmailWhereInputObjectSchema as OrderEmailWhereInputObjectSchema } from './objects/OrderEmailWhereInput.schema';

export const OrderEmailDeleteManySchema: z.ZodType<Prisma.OrderEmailDeleteManyArgs> = z.object({ where: OrderEmailWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.OrderEmailDeleteManyArgs>;

export const OrderEmailDeleteManyZodSchema = z.object({ where: OrderEmailWhereInputObjectSchema.optional() }).strict();