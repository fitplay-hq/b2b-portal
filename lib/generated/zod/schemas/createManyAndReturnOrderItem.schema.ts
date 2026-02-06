import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderItemSelectObjectSchema as OrderItemSelectObjectSchema } from './objects/OrderItemSelect.schema';
import { OrderItemCreateManyInputObjectSchema as OrderItemCreateManyInputObjectSchema } from './objects/OrderItemCreateManyInput.schema';

export const OrderItemCreateManyAndReturnSchema: z.ZodType<Prisma.OrderItemCreateManyAndReturnArgs> = z.object({ select: OrderItemSelectObjectSchema.optional(), data: z.union([ OrderItemCreateManyInputObjectSchema, z.array(OrderItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.OrderItemCreateManyAndReturnArgs>;

export const OrderItemCreateManyAndReturnZodSchema = z.object({ select: OrderItemSelectObjectSchema.optional(), data: z.union([ OrderItemCreateManyInputObjectSchema, z.array(OrderItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();