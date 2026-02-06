import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleSelectObjectSchema as BundleSelectObjectSchema } from './objects/BundleSelect.schema';
import { BundleCreateManyInputObjectSchema as BundleCreateManyInputObjectSchema } from './objects/BundleCreateManyInput.schema';

export const BundleCreateManyAndReturnSchema: z.ZodType<Prisma.BundleCreateManyAndReturnArgs> = z.object({ select: BundleSelectObjectSchema.optional(), data: z.union([ BundleCreateManyInputObjectSchema, z.array(BundleCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.BundleCreateManyAndReturnArgs>;

export const BundleCreateManyAndReturnZodSchema = z.object({ select: BundleSelectObjectSchema.optional(), data: z.union([ BundleCreateManyInputObjectSchema, z.array(BundleCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();