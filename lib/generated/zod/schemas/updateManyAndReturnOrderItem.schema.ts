import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderItemSelectObjectSchema as OrderItemSelectObjectSchema } from './objects/OrderItemSelect.schema';
import { OrderItemUpdateManyMutationInputObjectSchema as OrderItemUpdateManyMutationInputObjectSchema } from './objects/OrderItemUpdateManyMutationInput.schema';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './objects/OrderItemWhereInput.schema';

export const OrderItemUpdateManyAndReturnSchema: z.ZodType<Prisma.OrderItemUpdateManyAndReturnArgs> = z.object({ select: OrderItemSelectObjectSchema.optional(), data: OrderItemUpdateManyMutationInputObjectSchema, where: OrderItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.OrderItemUpdateManyAndReturnArgs>;

export const OrderItemUpdateManyAndReturnZodSchema = z.object({ select: OrderItemSelectObjectSchema.optional(), data: OrderItemUpdateManyMutationInputObjectSchema, where: OrderItemWhereInputObjectSchema.optional() }).strict();