import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleOrderItemSelectObjectSchema as BundleOrderItemSelectObjectSchema } from './objects/BundleOrderItemSelect.schema';
import { BundleOrderItemIncludeObjectSchema as BundleOrderItemIncludeObjectSchema } from './objects/BundleOrderItemInclude.schema';
import { BundleOrderItemUpdateInputObjectSchema as BundleOrderItemUpdateInputObjectSchema } from './objects/BundleOrderItemUpdateInput.schema';
import { BundleOrderItemUncheckedUpdateInputObjectSchema as BundleOrderItemUncheckedUpdateInputObjectSchema } from './objects/BundleOrderItemUncheckedUpdateInput.schema';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './objects/BundleOrderItemWhereUniqueInput.schema';

export const BundleOrderItemUpdateOneSchema: z.ZodType<Prisma.BundleOrderItemUpdateArgs> = z.object({ select: BundleOrderItemSelectObjectSchema.optional(), include: BundleOrderItemIncludeObjectSchema.optional(), data: z.union([BundleOrderItemUpdateInputObjectSchema, BundleOrderItemUncheckedUpdateInputObjectSchema]), where: BundleOrderItemWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.BundleOrderItemUpdateArgs>;

export const BundleOrderItemUpdateOneZodSchema = z.object({ select: BundleOrderItemSelectObjectSchema.optional(), include: BundleOrderItemIncludeObjectSchema.optional(), data: z.union([BundleOrderItemUpdateInputObjectSchema, BundleOrderItemUncheckedUpdateInputObjectSchema]), where: BundleOrderItemWhereUniqueInputObjectSchema }).strict();