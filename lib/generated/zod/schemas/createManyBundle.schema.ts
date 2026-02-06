import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleCreateManyInputObjectSchema as BundleCreateManyInputObjectSchema } from './objects/BundleCreateManyInput.schema';

export const BundleCreateManySchema: z.ZodType<Prisma.BundleCreateManyArgs> = z.object({ data: z.union([ BundleCreateManyInputObjectSchema, z.array(BundleCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.BundleCreateManyArgs>;

export const BundleCreateManyZodSchema = z.object({ data: z.union([ BundleCreateManyInputObjectSchema, z.array(BundleCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();