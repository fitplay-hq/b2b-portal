import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleSelectObjectSchema as BundleSelectObjectSchema } from './objects/BundleSelect.schema';
import { BundleIncludeObjectSchema as BundleIncludeObjectSchema } from './objects/BundleInclude.schema';
import { BundleUpdateInputObjectSchema as BundleUpdateInputObjectSchema } from './objects/BundleUpdateInput.schema';
import { BundleUncheckedUpdateInputObjectSchema as BundleUncheckedUpdateInputObjectSchema } from './objects/BundleUncheckedUpdateInput.schema';
import { BundleWhereUniqueInputObjectSchema as BundleWhereUniqueInputObjectSchema } from './objects/BundleWhereUniqueInput.schema';

export const BundleUpdateOneSchema: z.ZodType<Prisma.BundleUpdateArgs> = z.object({ select: BundleSelectObjectSchema.optional(), include: BundleIncludeObjectSchema.optional(), data: z.union([BundleUpdateInputObjectSchema, BundleUncheckedUpdateInputObjectSchema]), where: BundleWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.BundleUpdateArgs>;

export const BundleUpdateOneZodSchema = z.object({ select: BundleSelectObjectSchema.optional(), include: BundleIncludeObjectSchema.optional(), data: z.union([BundleUpdateInputObjectSchema, BundleUncheckedUpdateInputObjectSchema]), where: BundleWhereUniqueInputObjectSchema }).strict();