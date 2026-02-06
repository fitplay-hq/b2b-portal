import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderSelectObjectSchema as OrderSelectObjectSchema } from './objects/OrderSelect.schema';
import { OrderIncludeObjectSchema as OrderIncludeObjectSchema } from './objects/OrderInclude.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './objects/OrderWhereUniqueInput.schema';
import { OrderCreateInputObjectSchema as OrderCreateInputObjectSchema } from './objects/OrderCreateInput.schema';
import { OrderUncheckedCreateInputObjectSchema as OrderUncheckedCreateInputObjectSchema } from './objects/OrderUncheckedCreateInput.schema';
import { OrderUpdateInputObjectSchema as OrderUpdateInputObjectSchema } from './objects/OrderUpdateInput.schema';
import { OrderUncheckedUpdateInputObjectSchema as OrderUncheckedUpdateInputObjectSchema } from './objects/OrderUncheckedUpdateInput.schema';

export const OrderUpsertOneSchema: z.ZodType<Prisma.OrderUpsertArgs> = z.object({ select: OrderSelectObjectSchema.optional(), include: OrderIncludeObjectSchema.optional(), where: OrderWhereUniqueInputObjectSchema, create: z.union([ OrderCreateInputObjectSchema, OrderUncheckedCreateInputObjectSchema ]), update: z.union([ OrderUpdateInputObjectSchema, OrderUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.OrderUpsertArgs>;

export const OrderUpsertOneZodSchema = z.object({ select: OrderSelectObjectSchema.optional(), include: OrderIncludeObjectSchema.optional(), where: OrderWhereUniqueInputObjectSchema, create: z.union([ OrderCreateInputObjectSchema, OrderUncheckedCreateInputObjectSchema ]), update: z.union([ OrderUpdateInputObjectSchema, OrderUncheckedUpdateInputObjectSchema ]) }).strict();