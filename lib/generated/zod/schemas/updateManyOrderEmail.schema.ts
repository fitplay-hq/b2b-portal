import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderEmailUpdateManyMutationInputObjectSchema as OrderEmailUpdateManyMutationInputObjectSchema } from './objects/OrderEmailUpdateManyMutationInput.schema';
import { OrderEmailWhereInputObjectSchema as OrderEmailWhereInputObjectSchema } from './objects/OrderEmailWhereInput.schema';

export const OrderEmailUpdateManySchema: z.ZodType<Prisma.OrderEmailUpdateManyArgs> = z.object({ data: OrderEmailUpdateManyMutationInputObjectSchema, where: OrderEmailWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.OrderEmailUpdateManyArgs>;

export const OrderEmailUpdateManyZodSchema = z.object({ data: OrderEmailUpdateManyMutationInputObjectSchema, where: OrderEmailWhereInputObjectSchema.optional() }).strict();