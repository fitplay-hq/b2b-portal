import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleItemSelectObjectSchema as BundleItemSelectObjectSchema } from './objects/BundleItemSelect.schema';
import { BundleItemIncludeObjectSchema as BundleItemIncludeObjectSchema } from './objects/BundleItemInclude.schema';
import { BundleItemUpdateInputObjectSchema as BundleItemUpdateInputObjectSchema } from './objects/BundleItemUpdateInput.schema';
import { BundleItemUncheckedUpdateInputObjectSchema as BundleItemUncheckedUpdateInputObjectSchema } from './objects/BundleItemUncheckedUpdateInput.schema';
import { BundleItemWhereUniqueInputObjectSchema as BundleItemWhereUniqueInputObjectSchema } from './objects/BundleItemWhereUniqueInput.schema';

export const BundleItemUpdateOneSchema: z.ZodType<Prisma.BundleItemUpdateArgs> = z.object({ select: BundleItemSelectObjectSchema.optional(), include: BundleItemIncludeObjectSchema.optional(), data: z.union([BundleItemUpdateInputObjectSchema, BundleItemUncheckedUpdateInputObjectSchema]), where: BundleItemWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.BundleItemUpdateArgs>;

export const BundleItemUpdateOneZodSchema = z.object({ select: BundleItemSelectObjectSchema.optional(), include: BundleItemIncludeObjectSchema.optional(), data: z.union([BundleItemUpdateInputObjectSchema, BundleItemUncheckedUpdateInputObjectSchema]), where: BundleItemWhereUniqueInputObjectSchema }).strict();