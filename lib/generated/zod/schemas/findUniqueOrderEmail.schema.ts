import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderEmailSelectObjectSchema as OrderEmailSelectObjectSchema } from './objects/OrderEmailSelect.schema';
import { OrderEmailIncludeObjectSchema as OrderEmailIncludeObjectSchema } from './objects/OrderEmailInclude.schema';
import { OrderEmailWhereUniqueInputObjectSchema as OrderEmailWhereUniqueInputObjectSchema } from './objects/OrderEmailWhereUniqueInput.schema';

export const OrderEmailFindUniqueSchema: z.ZodType<Prisma.OrderEmailFindUniqueArgs> = z.object({ select: OrderEmailSelectObjectSchema.optional(), include: OrderEmailIncludeObjectSchema.optional(), where: OrderEmailWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.OrderEmailFindUniqueArgs>;

export const OrderEmailFindUniqueZodSchema = z.object({ select: OrderEmailSelectObjectSchema.optional(), include: OrderEmailIncludeObjectSchema.optional(), where: OrderEmailWhereUniqueInputObjectSchema }).strict();