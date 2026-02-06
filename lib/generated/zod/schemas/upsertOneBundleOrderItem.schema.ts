import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleOrderItemSelectObjectSchema as BundleOrderItemSelectObjectSchema } from './objects/BundleOrderItemSelect.schema';
import { BundleOrderItemIncludeObjectSchema as BundleOrderItemIncludeObjectSchema } from './objects/BundleOrderItemInclude.schema';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './objects/BundleOrderItemWhereUniqueInput.schema';
import { BundleOrderItemCreateInputObjectSchema as BundleOrderItemCreateInputObjectSchema } from './objects/BundleOrderItemCreateInput.schema';
import { BundleOrderItemUncheckedCreateInputObjectSchema as BundleOrderItemUncheckedCreateInputObjectSchema } from './objects/BundleOrderItemUncheckedCreateInput.schema';
import { BundleOrderItemUpdateInputObjectSchema as BundleOrderItemUpdateInputObjectSchema } from './objects/BundleOrderItemUpdateInput.schema';
import { BundleOrderItemUncheckedUpdateInputObjectSchema as BundleOrderItemUncheckedUpdateInputObjectSchema } from './objects/BundleOrderItemUncheckedUpdateInput.schema';

export const BundleOrderItemUpsertOneSchema: z.ZodType<Prisma.BundleOrderItemUpsertArgs> = z.object({ select: BundleOrderItemSelectObjectSchema.optional(), include: BundleOrderItemIncludeObjectSchema.optional(), where: BundleOrderItemWhereUniqueInputObjectSchema, create: z.union([ BundleOrderItemCreateInputObjectSchema, BundleOrderItemUncheckedCreateInputObjectSchema ]), update: z.union([ BundleOrderItemUpdateInputObjectSchema, BundleOrderItemUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.BundleOrderItemUpsertArgs>;

export const BundleOrderItemUpsertOneZodSchema = z.object({ select: BundleOrderItemSelectObjectSchema.optional(), include: BundleOrderItemIncludeObjectSchema.optional(), where: BundleOrderItemWhereUniqueInputObjectSchema, create: z.union([ BundleOrderItemCreateInputObjectSchema, BundleOrderItemUncheckedCreateInputObjectSchema ]), update: z.union([ BundleOrderItemUpdateInputObjectSchema, BundleOrderItemUncheckedUpdateInputObjectSchema ]) }).strict();