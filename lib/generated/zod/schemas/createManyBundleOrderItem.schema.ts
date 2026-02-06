import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleOrderItemCreateManyInputObjectSchema as BundleOrderItemCreateManyInputObjectSchema } from './objects/BundleOrderItemCreateManyInput.schema';

export const BundleOrderItemCreateManySchema: z.ZodType<Prisma.BundleOrderItemCreateManyArgs> = z.object({ data: z.union([ BundleOrderItemCreateManyInputObjectSchema, z.array(BundleOrderItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.BundleOrderItemCreateManyArgs>;

export const BundleOrderItemCreateManyZodSchema = z.object({ data: z.union([ BundleOrderItemCreateManyInputObjectSchema, z.array(BundleOrderItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();