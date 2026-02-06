import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleOrderItemSelectObjectSchema as BundleOrderItemSelectObjectSchema } from './objects/BundleOrderItemSelect.schema';
import { BundleOrderItemIncludeObjectSchema as BundleOrderItemIncludeObjectSchema } from './objects/BundleOrderItemInclude.schema';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './objects/BundleOrderItemWhereUniqueInput.schema';

export const BundleOrderItemFindUniqueOrThrowSchema: z.ZodType<Prisma.BundleOrderItemFindUniqueOrThrowArgs> = z.object({ select: BundleOrderItemSelectObjectSchema.optional(), include: BundleOrderItemIncludeObjectSchema.optional(), where: BundleOrderItemWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.BundleOrderItemFindUniqueOrThrowArgs>;

export const BundleOrderItemFindUniqueOrThrowZodSchema = z.object({ select: BundleOrderItemSelectObjectSchema.optional(), include: BundleOrderItemIncludeObjectSchema.optional(), where: BundleOrderItemWhereUniqueInputObjectSchema }).strict();