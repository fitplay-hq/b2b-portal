import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderItemSelectObjectSchema as OrderItemSelectObjectSchema } from './objects/OrderItemSelect.schema';
import { OrderItemIncludeObjectSchema as OrderItemIncludeObjectSchema } from './objects/OrderItemInclude.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './objects/OrderItemWhereUniqueInput.schema';

export const OrderItemFindUniqueSchema: z.ZodType<Prisma.OrderItemFindUniqueArgs> = z.object({ select: OrderItemSelectObjectSchema.optional(), include: OrderItemIncludeObjectSchema.optional(), where: OrderItemWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.OrderItemFindUniqueArgs>;

export const OrderItemFindUniqueZodSchema = z.object({ select: OrderItemSelectObjectSchema.optional(), include: OrderItemIncludeObjectSchema.optional(), where: OrderItemWhereUniqueInputObjectSchema }).strict();