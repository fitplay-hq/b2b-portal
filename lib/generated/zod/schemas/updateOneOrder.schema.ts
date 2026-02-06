import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderSelectObjectSchema as OrderSelectObjectSchema } from './objects/OrderSelect.schema';
import { OrderIncludeObjectSchema as OrderIncludeObjectSchema } from './objects/OrderInclude.schema';
import { OrderUpdateInputObjectSchema as OrderUpdateInputObjectSchema } from './objects/OrderUpdateInput.schema';
import { OrderUncheckedUpdateInputObjectSchema as OrderUncheckedUpdateInputObjectSchema } from './objects/OrderUncheckedUpdateInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './objects/OrderWhereUniqueInput.schema';

export const OrderUpdateOneSchema: z.ZodType<Prisma.OrderUpdateArgs> = z.object({ select: OrderSelectObjectSchema.optional(), include: OrderIncludeObjectSchema.optional(), data: z.union([OrderUpdateInputObjectSchema, OrderUncheckedUpdateInputObjectSchema]), where: OrderWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.OrderUpdateArgs>;

export const OrderUpdateOneZodSchema = z.object({ select: OrderSelectObjectSchema.optional(), include: OrderIncludeObjectSchema.optional(), data: z.union([OrderUpdateInputObjectSchema, OrderUncheckedUpdateInputObjectSchema]), where: OrderWhereUniqueInputObjectSchema }).strict();