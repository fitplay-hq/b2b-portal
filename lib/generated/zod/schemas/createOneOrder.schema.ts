import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderSelectObjectSchema as OrderSelectObjectSchema } from './objects/OrderSelect.schema';
import { OrderIncludeObjectSchema as OrderIncludeObjectSchema } from './objects/OrderInclude.schema';
import { OrderCreateInputObjectSchema as OrderCreateInputObjectSchema } from './objects/OrderCreateInput.schema';
import { OrderUncheckedCreateInputObjectSchema as OrderUncheckedCreateInputObjectSchema } from './objects/OrderUncheckedCreateInput.schema';

export const OrderCreateOneSchema: z.ZodType<Prisma.OrderCreateArgs> = z.object({ select: OrderSelectObjectSchema.optional(), include: OrderIncludeObjectSchema.optional(), data: z.union([OrderCreateInputObjectSchema, OrderUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.OrderCreateArgs>;

export const OrderCreateOneZodSchema = z.object({ select: OrderSelectObjectSchema.optional(), include: OrderIncludeObjectSchema.optional(), data: z.union([OrderCreateInputObjectSchema, OrderUncheckedCreateInputObjectSchema]) }).strict();