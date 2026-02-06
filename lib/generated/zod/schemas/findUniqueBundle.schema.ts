import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleSelectObjectSchema as BundleSelectObjectSchema } from './objects/BundleSelect.schema';
import { BundleIncludeObjectSchema as BundleIncludeObjectSchema } from './objects/BundleInclude.schema';
import { BundleWhereUniqueInputObjectSchema as BundleWhereUniqueInputObjectSchema } from './objects/BundleWhereUniqueInput.schema';

export const BundleFindUniqueSchema: z.ZodType<Prisma.BundleFindUniqueArgs> = z.object({ select: BundleSelectObjectSchema.optional(), include: BundleIncludeObjectSchema.optional(), where: BundleWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.BundleFindUniqueArgs>;

export const BundleFindUniqueZodSchema = z.object({ select: BundleSelectObjectSchema.optional(), include: BundleIncludeObjectSchema.optional(), where: BundleWhereUniqueInputObjectSchema }).strict();