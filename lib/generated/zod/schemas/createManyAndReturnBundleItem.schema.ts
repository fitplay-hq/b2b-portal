import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleItemSelectObjectSchema as BundleItemSelectObjectSchema } from './objects/BundleItemSelect.schema';
import { BundleItemCreateManyInputObjectSchema as BundleItemCreateManyInputObjectSchema } from './objects/BundleItemCreateManyInput.schema';

export const BundleItemCreateManyAndReturnSchema: z.ZodType<Prisma.BundleItemCreateManyAndReturnArgs> = z.object({ select: BundleItemSelectObjectSchema.optional(), data: z.union([ BundleItemCreateManyInputObjectSchema, z.array(BundleItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.BundleItemCreateManyAndReturnArgs>;

export const BundleItemCreateManyAndReturnZodSchema = z.object({ select: BundleItemSelectObjectSchema.optional(), data: z.union([ BundleItemCreateManyInputObjectSchema, z.array(BundleItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();