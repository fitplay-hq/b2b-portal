import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderEmailSelectObjectSchema as OrderEmailSelectObjectSchema } from './objects/OrderEmailSelect.schema';
import { OrderEmailIncludeObjectSchema as OrderEmailIncludeObjectSchema } from './objects/OrderEmailInclude.schema';
import { OrderEmailCreateInputObjectSchema as OrderEmailCreateInputObjectSchema } from './objects/OrderEmailCreateInput.schema';
import { OrderEmailUncheckedCreateInputObjectSchema as OrderEmailUncheckedCreateInputObjectSchema } from './objects/OrderEmailUncheckedCreateInput.schema';

export const OrderEmailCreateOneSchema: z.ZodType<Prisma.OrderEmailCreateArgs> = z.object({ select: OrderEmailSelectObjectSchema.optional(), include: OrderEmailIncludeObjectSchema.optional(), data: z.union([OrderEmailCreateInputObjectSchema, OrderEmailUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.OrderEmailCreateArgs>;

export const OrderEmailCreateOneZodSchema = z.object({ select: OrderEmailSelectObjectSchema.optional(), include: OrderEmailIncludeObjectSchema.optional(), data: z.union([OrderEmailCreateInputObjectSchema, OrderEmailUncheckedCreateInputObjectSchema]) }).strict();