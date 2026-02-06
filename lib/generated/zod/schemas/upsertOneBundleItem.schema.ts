import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleItemSelectObjectSchema as BundleItemSelectObjectSchema } from './objects/BundleItemSelect.schema';
import { BundleItemIncludeObjectSchema as BundleItemIncludeObjectSchema } from './objects/BundleItemInclude.schema';
import { BundleItemWhereUniqueInputObjectSchema as BundleItemWhereUniqueInputObjectSchema } from './objects/BundleItemWhereUniqueInput.schema';
import { BundleItemCreateInputObjectSchema as BundleItemCreateInputObjectSchema } from './objects/BundleItemCreateInput.schema';
import { BundleItemUncheckedCreateInputObjectSchema as BundleItemUncheckedCreateInputObjectSchema } from './objects/BundleItemUncheckedCreateInput.schema';
import { BundleItemUpdateInputObjectSchema as BundleItemUpdateInputObjectSchema } from './objects/BundleItemUpdateInput.schema';
import { BundleItemUncheckedUpdateInputObjectSchema as BundleItemUncheckedUpdateInputObjectSchema } from './objects/BundleItemUncheckedUpdateInput.schema';

export const BundleItemUpsertOneSchema: z.ZodType<Prisma.BundleItemUpsertArgs> = z.object({ select: BundleItemSelectObjectSchema.optional(), include: BundleItemIncludeObjectSchema.optional(), where: BundleItemWhereUniqueInputObjectSchema, create: z.union([ BundleItemCreateInputObjectSchema, BundleItemUncheckedCreateInputObjectSchema ]), update: z.union([ BundleItemUpdateInputObjectSchema, BundleItemUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.BundleItemUpsertArgs>;

export const BundleItemUpsertOneZodSchema = z.object({ select: BundleItemSelectObjectSchema.optional(), include: BundleItemIncludeObjectSchema.optional(), where: BundleItemWhereUniqueInputObjectSchema, create: z.union([ BundleItemCreateInputObjectSchema, BundleItemUncheckedCreateInputObjectSchema ]), update: z.union([ BundleItemUpdateInputObjectSchema, BundleItemUncheckedUpdateInputObjectSchema ]) }).strict();