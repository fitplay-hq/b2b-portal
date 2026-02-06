import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderSelectObjectSchema as OrderSelectObjectSchema } from './objects/OrderSelect.schema';
import { OrderIncludeObjectSchema as OrderIncludeObjectSchema } from './objects/OrderInclude.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './objects/OrderWhereUniqueInput.schema';

export const OrderDeleteOneSchema: z.ZodType<Prisma.OrderDeleteArgs> = z.object({ select: OrderSelectObjectSchema.optional(), include: OrderIncludeObjectSchema.optional(), where: OrderWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.OrderDeleteArgs>;

export const OrderDeleteOneZodSchema = z.object({ select: OrderSelectObjectSchema.optional(), include: OrderIncludeObjectSchema.optional(), where: OrderWhereUniqueInputObjectSchema }).strict();