import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleItemCreateManyInputObjectSchema as BundleItemCreateManyInputObjectSchema } from './objects/BundleItemCreateManyInput.schema';

export const BundleItemCreateManySchema: z.ZodType<Prisma.BundleItemCreateManyArgs> = z.object({ data: z.union([ BundleItemCreateManyInputObjectSchema, z.array(BundleItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.BundleItemCreateManyArgs>;

export const BundleItemCreateManyZodSchema = z.object({ data: z.union([ BundleItemCreateManyInputObjectSchema, z.array(BundleItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();