import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderItemSelectObjectSchema as OrderItemSelectObjectSchema } from './objects/OrderItemSelect.schema';
import { OrderItemIncludeObjectSchema as OrderItemIncludeObjectSchema } from './objects/OrderItemInclude.schema';
import { OrderItemCreateInputObjectSchema as OrderItemCreateInputObjectSchema } from './objects/OrderItemCreateInput.schema';
import { OrderItemUncheckedCreateInputObjectSchema as OrderItemUncheckedCreateInputObjectSchema } from './objects/OrderItemUncheckedCreateInput.schema';

export const OrderItemCreateOneSchema: z.ZodType<Prisma.OrderItemCreateArgs> = z.object({ select: OrderItemSelectObjectSchema.optional(), include: OrderItemIncludeObjectSchema.optional(), data: z.union([OrderItemCreateInputObjectSchema, OrderItemUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.OrderItemCreateArgs>;

export const OrderItemCreateOneZodSchema = z.object({ select: OrderItemSelectObjectSchema.optional(), include: OrderItemIncludeObjectSchema.optional(), data: z.union([OrderItemCreateInputObjectSchema, OrderItemUncheckedCreateInputObjectSchema]) }).strict();