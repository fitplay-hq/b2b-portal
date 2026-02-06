import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderEmailSelectObjectSchema as OrderEmailSelectObjectSchema } from './objects/OrderEmailSelect.schema';
import { OrderEmailUpdateManyMutationInputObjectSchema as OrderEmailUpdateManyMutationInputObjectSchema } from './objects/OrderEmailUpdateManyMutationInput.schema';
import { OrderEmailWhereInputObjectSchema as OrderEmailWhereInputObjectSchema } from './objects/OrderEmailWhereInput.schema';

export const OrderEmailUpdateManyAndReturnSchema: z.ZodType<Prisma.OrderEmailUpdateManyAndReturnArgs> = z.object({ select: OrderEmailSelectObjectSchema.optional(), data: OrderEmailUpdateManyMutationInputObjectSchema, where: OrderEmailWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.OrderEmailUpdateManyAndReturnArgs>;

export const OrderEmailUpdateManyAndReturnZodSchema = z.object({ select: OrderEmailSelectObjectSchema.optional(), data: OrderEmailUpdateManyMutationInputObjectSchema, where: OrderEmailWhereInputObjectSchema.optional() }).strict();