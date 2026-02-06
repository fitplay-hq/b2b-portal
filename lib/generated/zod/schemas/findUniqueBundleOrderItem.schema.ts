import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleOrderItemSelectObjectSchema as BundleOrderItemSelectObjectSchema } from './objects/BundleOrderItemSelect.schema';
import { BundleOrderItemIncludeObjectSchema as BundleOrderItemIncludeObjectSchema } from './objects/BundleOrderItemInclude.schema';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './objects/BundleOrderItemWhereUniqueInput.schema';

export const BundleOrderItemFindUniqueSchema: z.ZodType<Prisma.BundleOrderItemFindUniqueArgs> = z.object({ select: BundleOrderItemSelectObjectSchema.optional(), include: BundleOrderItemIncludeObjectSchema.optional(), where: BundleOrderItemWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.BundleOrderItemFindUniqueArgs>;

export const BundleOrderItemFindUniqueZodSchema = z.object({ select: BundleOrderItemSelectObjectSchema.optional(), include: BundleOrderItemIncludeObjectSchema.optional(), where: BundleOrderItemWhereUniqueInputObjectSchema }).strict();