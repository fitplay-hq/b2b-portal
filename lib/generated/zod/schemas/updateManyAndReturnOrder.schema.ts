import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderSelectObjectSchema as OrderSelectObjectSchema } from './objects/OrderSelect.schema';
import { OrderUpdateManyMutationInputObjectSchema as OrderUpdateManyMutationInputObjectSchema } from './objects/OrderUpdateManyMutationInput.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './objects/OrderWhereInput.schema';

export const OrderUpdateManyAndReturnSchema: z.ZodType<Prisma.OrderUpdateManyAndReturnArgs> = z.object({ select: OrderSelectObjectSchema.optional(), data: OrderUpdateManyMutationInputObjectSchema, where: OrderWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.OrderUpdateManyAndReturnArgs>;

export const OrderUpdateManyAndReturnZodSchema = z.object({ select: OrderSelectObjectSchema.optional(), data: OrderUpdateManyMutationInputObjectSchema, where: OrderWhereInputObjectSchema.optional() }).strict();