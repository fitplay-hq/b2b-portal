import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleOrderItemSelectObjectSchema as BundleOrderItemSelectObjectSchema } from './objects/BundleOrderItemSelect.schema';
import { BundleOrderItemCreateManyInputObjectSchema as BundleOrderItemCreateManyInputObjectSchema } from './objects/BundleOrderItemCreateManyInput.schema';

export const BundleOrderItemCreateManyAndReturnSchema: z.ZodType<Prisma.BundleOrderItemCreateManyAndReturnArgs> = z.object({ select: BundleOrderItemSelectObjectSchema.optional(), data: z.union([ BundleOrderItemCreateManyInputObjectSchema, z.array(BundleOrderItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.BundleOrderItemCreateManyAndReturnArgs>;

export const BundleOrderItemCreateManyAndReturnZodSchema = z.object({ select: BundleOrderItemSelectObjectSchema.optional(), data: z.union([ BundleOrderItemCreateManyInputObjectSchema, z.array(BundleOrderItemCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();