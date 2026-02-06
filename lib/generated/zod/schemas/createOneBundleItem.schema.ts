import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleItemSelectObjectSchema as BundleItemSelectObjectSchema } from './objects/BundleItemSelect.schema';
import { BundleItemIncludeObjectSchema as BundleItemIncludeObjectSchema } from './objects/BundleItemInclude.schema';
import { BundleItemCreateInputObjectSchema as BundleItemCreateInputObjectSchema } from './objects/BundleItemCreateInput.schema';
import { BundleItemUncheckedCreateInputObjectSchema as BundleItemUncheckedCreateInputObjectSchema } from './objects/BundleItemUncheckedCreateInput.schema';

export const BundleItemCreateOneSchema: z.ZodType<Prisma.BundleItemCreateArgs> = z.object({ select: BundleItemSelectObjectSchema.optional(), include: BundleItemIncludeObjectSchema.optional(), data: z.union([BundleItemCreateInputObjectSchema, BundleItemUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.BundleItemCreateArgs>;

export const BundleItemCreateOneZodSchema = z.object({ select: BundleItemSelectObjectSchema.optional(), include: BundleItemIncludeObjectSchema.optional(), data: z.union([BundleItemCreateInputObjectSchema, BundleItemUncheckedCreateInputObjectSchema]) }).strict();