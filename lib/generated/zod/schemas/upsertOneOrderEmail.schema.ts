import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderEmailSelectObjectSchema as OrderEmailSelectObjectSchema } from './objects/OrderEmailSelect.schema';
import { OrderEmailIncludeObjectSchema as OrderEmailIncludeObjectSchema } from './objects/OrderEmailInclude.schema';
import { OrderEmailWhereUniqueInputObjectSchema as OrderEmailWhereUniqueInputObjectSchema } from './objects/OrderEmailWhereUniqueInput.schema';
import { OrderEmailCreateInputObjectSchema as OrderEmailCreateInputObjectSchema } from './objects/OrderEmailCreateInput.schema';
import { OrderEmailUncheckedCreateInputObjectSchema as OrderEmailUncheckedCreateInputObjectSchema } from './objects/OrderEmailUncheckedCreateInput.schema';
import { OrderEmailUpdateInputObjectSchema as OrderEmailUpdateInputObjectSchema } from './objects/OrderEmailUpdateInput.schema';
import { OrderEmailUncheckedUpdateInputObjectSchema as OrderEmailUncheckedUpdateInputObjectSchema } from './objects/OrderEmailUncheckedUpdateInput.schema';

export const OrderEmailUpsertOneSchema: z.ZodType<Prisma.OrderEmailUpsertArgs> = z.object({ select: OrderEmailSelectObjectSchema.optional(), include: OrderEmailIncludeObjectSchema.optional(), where: OrderEmailWhereUniqueInputObjectSchema, create: z.union([ OrderEmailCreateInputObjectSchema, OrderEmailUncheckedCreateInputObjectSchema ]), update: z.union([ OrderEmailUpdateInputObjectSchema, OrderEmailUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.OrderEmailUpsertArgs>;

export const OrderEmailUpsertOneZodSchema = z.object({ select: OrderEmailSelectObjectSchema.optional(), include: OrderEmailIncludeObjectSchema.optional(), where: OrderEmailWhereUniqueInputObjectSchema, create: z.union([ OrderEmailCreateInputObjectSchema, OrderEmailUncheckedCreateInputObjectSchema ]), update: z.union([ OrderEmailUpdateInputObjectSchema, OrderEmailUncheckedUpdateInputObjectSchema ]) }).strict();