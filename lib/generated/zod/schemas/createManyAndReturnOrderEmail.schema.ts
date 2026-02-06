import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderEmailSelectObjectSchema as OrderEmailSelectObjectSchema } from './objects/OrderEmailSelect.schema';
import { OrderEmailCreateManyInputObjectSchema as OrderEmailCreateManyInputObjectSchema } from './objects/OrderEmailCreateManyInput.schema';

export const OrderEmailCreateManyAndReturnSchema: z.ZodType<Prisma.OrderEmailCreateManyAndReturnArgs> = z.object({ select: OrderEmailSelectObjectSchema.optional(), data: z.union([ OrderEmailCreateManyInputObjectSchema, z.array(OrderEmailCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.OrderEmailCreateManyAndReturnArgs>;

export const OrderEmailCreateManyAndReturnZodSchema = z.object({ select: OrderEmailSelectObjectSchema.optional(), data: z.union([ OrderEmailCreateManyInputObjectSchema, z.array(OrderEmailCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();