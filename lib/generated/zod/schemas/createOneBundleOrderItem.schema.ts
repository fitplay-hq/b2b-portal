import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleOrderItemSelectObjectSchema as BundleOrderItemSelectObjectSchema } from './objects/BundleOrderItemSelect.schema';
import { BundleOrderItemIncludeObjectSchema as BundleOrderItemIncludeObjectSchema } from './objects/BundleOrderItemInclude.schema';
import { BundleOrderItemCreateInputObjectSchema as BundleOrderItemCreateInputObjectSchema } from './objects/BundleOrderItemCreateInput.schema';
import { BundleOrderItemUncheckedCreateInputObjectSchema as BundleOrderItemUncheckedCreateInputObjectSchema } from './objects/BundleOrderItemUncheckedCreateInput.schema';

export const BundleOrderItemCreateOneSchema: z.ZodType<Prisma.BundleOrderItemCreateArgs> = z.object({ select: BundleOrderItemSelectObjectSchema.optional(), include: BundleOrderItemIncludeObjectSchema.optional(), data: z.union([BundleOrderItemCreateInputObjectSchema, BundleOrderItemUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.BundleOrderItemCreateArgs>;

export const BundleOrderItemCreateOneZodSchema = z.object({ select: BundleOrderItemSelectObjectSchema.optional(), include: BundleOrderItemIncludeObjectSchema.optional(), data: z.union([BundleOrderItemCreateInputObjectSchema, BundleOrderItemUncheckedCreateInputObjectSchema]) }).strict();