import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderItemUpdateManyMutationInputObjectSchema as OrderItemUpdateManyMutationInputObjectSchema } from './objects/OrderItemUpdateManyMutationInput.schema';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './objects/OrderItemWhereInput.schema';

export const OrderItemUpdateManySchema: z.ZodType<Prisma.OrderItemUpdateManyArgs> = z.object({ data: OrderItemUpdateManyMutationInputObjectSchema, where: OrderItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.OrderItemUpdateManyArgs>;

export const OrderItemUpdateManyZodSchema = z.object({ data: OrderItemUpdateManyMutationInputObjectSchema, where: OrderItemWhereInputObjectSchema.optional() }).strict();