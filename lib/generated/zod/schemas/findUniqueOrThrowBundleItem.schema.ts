import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleItemSelectObjectSchema as BundleItemSelectObjectSchema } from './objects/BundleItemSelect.schema';
import { BundleItemIncludeObjectSchema as BundleItemIncludeObjectSchema } from './objects/BundleItemInclude.schema';
import { BundleItemWhereUniqueInputObjectSchema as BundleItemWhereUniqueInputObjectSchema } from './objects/BundleItemWhereUniqueInput.schema';

export const BundleItemFindUniqueOrThrowSchema: z.ZodType<Prisma.BundleItemFindUniqueOrThrowArgs> = z.object({ select: BundleItemSelectObjectSchema.optional(), include: BundleItemIncludeObjectSchema.optional(), where: BundleItemWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.BundleItemFindUniqueOrThrowArgs>;

export const BundleItemFindUniqueOrThrowZodSchema = z.object({ select: BundleItemSelectObjectSchema.optional(), include: BundleItemIncludeObjectSchema.optional(), where: BundleItemWhereUniqueInputObjectSchema }).strict();