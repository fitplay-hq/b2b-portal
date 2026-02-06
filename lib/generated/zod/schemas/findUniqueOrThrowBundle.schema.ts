import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleSelectObjectSchema as BundleSelectObjectSchema } from './objects/BundleSelect.schema';
import { BundleIncludeObjectSchema as BundleIncludeObjectSchema } from './objects/BundleInclude.schema';
import { BundleWhereUniqueInputObjectSchema as BundleWhereUniqueInputObjectSchema } from './objects/BundleWhereUniqueInput.schema';

export const BundleFindUniqueOrThrowSchema: z.ZodType<Prisma.BundleFindUniqueOrThrowArgs> = z.object({ select: BundleSelectObjectSchema.optional(), include: BundleIncludeObjectSchema.optional(), where: BundleWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.BundleFindUniqueOrThrowArgs>;

export const BundleFindUniqueOrThrowZodSchema = z.object({ select: BundleSelectObjectSchema.optional(), include: BundleIncludeObjectSchema.optional(), where: BundleWhereUniqueInputObjectSchema }).strict();