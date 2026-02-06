import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderItemSelectObjectSchema as OrderItemSelectObjectSchema } from './objects/OrderItemSelect.schema';
import { OrderItemIncludeObjectSchema as OrderItemIncludeObjectSchema } from './objects/OrderItemInclude.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './objects/OrderItemWhereUniqueInput.schema';
import { OrderItemCreateInputObjectSchema as OrderItemCreateInputObjectSchema } from './objects/OrderItemCreateInput.schema';
import { OrderItemUncheckedCreateInputObjectSchema as OrderItemUncheckedCreateInputObjectSchema } from './objects/OrderItemUncheckedCreateInput.schema';
import { OrderItemUpdateInputObjectSchema as OrderItemUpdateInputObjectSchema } from './objects/OrderItemUpdateInput.schema';
import { OrderItemUncheckedUpdateInputObjectSchema as OrderItemUncheckedUpdateInputObjectSchema } from './objects/OrderItemUncheckedUpdateInput.schema';

export const OrderItemUpsertOneSchema: z.ZodType<Prisma.OrderItemUpsertArgs> = z.object({ select: OrderItemSelectObjectSchema.optional(), include: OrderItemIncludeObjectSchema.optional(), where: OrderItemWhereUniqueInputObjectSchema, create: z.union([ OrderItemCreateInputObjectSchema, OrderItemUncheckedCreateInputObjectSchema ]), update: z.union([ OrderItemUpdateInputObjectSchema, OrderItemUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.OrderItemUpsertArgs>;

export const OrderItemUpsertOneZodSchema = z.object({ select: OrderItemSelectObjectSchema.optional(), include: OrderItemIncludeObjectSchema.optional(), where: OrderItemWhereUniqueInputObjectSchema, create: z.union([ OrderItemCreateInputObjectSchema, OrderItemUncheckedCreateInputObjectSchema ]), update: z.union([ OrderItemUpdateInputObjectSchema, OrderItemUncheckedUpdateInputObjectSchema ]) }).strict();