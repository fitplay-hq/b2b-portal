import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderEmailCreateManyInputObjectSchema as OrderEmailCreateManyInputObjectSchema } from './objects/OrderEmailCreateManyInput.schema';

export const OrderEmailCreateManySchema: z.ZodType<Prisma.OrderEmailCreateManyArgs> = z.object({ data: z.union([ OrderEmailCreateManyInputObjectSchema, z.array(OrderEmailCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.OrderEmailCreateManyArgs>;

export const OrderEmailCreateManyZodSchema = z.object({ data: z.union([ OrderEmailCreateManyInputObjectSchema, z.array(OrderEmailCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();