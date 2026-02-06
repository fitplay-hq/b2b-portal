import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderEmailSelectObjectSchema as OrderEmailSelectObjectSchema } from './objects/OrderEmailSelect.schema';
import { OrderEmailIncludeObjectSchema as OrderEmailIncludeObjectSchema } from './objects/OrderEmailInclude.schema';
import { OrderEmailUpdateInputObjectSchema as OrderEmailUpdateInputObjectSchema } from './objects/OrderEmailUpdateInput.schema';
import { OrderEmailUncheckedUpdateInputObjectSchema as OrderEmailUncheckedUpdateInputObjectSchema } from './objects/OrderEmailUncheckedUpdateInput.schema';
import { OrderEmailWhereUniqueInputObjectSchema as OrderEmailWhereUniqueInputObjectSchema } from './objects/OrderEmailWhereUniqueInput.schema';

export const OrderEmailUpdateOneSchema: z.ZodType<Prisma.OrderEmailUpdateArgs> = z.object({ select: OrderEmailSelectObjectSchema.optional(), include: OrderEmailIncludeObjectSchema.optional(), data: z.union([OrderEmailUpdateInputObjectSchema, OrderEmailUncheckedUpdateInputObjectSchema]), where: OrderEmailWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.OrderEmailUpdateArgs>;

export const OrderEmailUpdateOneZodSchema = z.object({ select: OrderEmailSelectObjectSchema.optional(), include: OrderEmailIncludeObjectSchema.optional(), data: z.union([OrderEmailUpdateInputObjectSchema, OrderEmailUncheckedUpdateInputObjectSchema]), where: OrderEmailWhereUniqueInputObjectSchema }).strict();