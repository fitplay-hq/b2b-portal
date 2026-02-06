import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleSelectObjectSchema as BundleSelectObjectSchema } from './objects/BundleSelect.schema';
import { BundleIncludeObjectSchema as BundleIncludeObjectSchema } from './objects/BundleInclude.schema';
import { BundleWhereUniqueInputObjectSchema as BundleWhereUniqueInputObjectSchema } from './objects/BundleWhereUniqueInput.schema';
import { BundleCreateInputObjectSchema as BundleCreateInputObjectSchema } from './objects/BundleCreateInput.schema';
import { BundleUncheckedCreateInputObjectSchema as BundleUncheckedCreateInputObjectSchema } from './objects/BundleUncheckedCreateInput.schema';
import { BundleUpdateInputObjectSchema as BundleUpdateInputObjectSchema } from './objects/BundleUpdateInput.schema';
import { BundleUncheckedUpdateInputObjectSchema as BundleUncheckedUpdateInputObjectSchema } from './objects/BundleUncheckedUpdateInput.schema';

export const BundleUpsertOneSchema: z.ZodType<Prisma.BundleUpsertArgs> = z.object({ select: BundleSelectObjectSchema.optional(), include: BundleIncludeObjectSchema.optional(), where: BundleWhereUniqueInputObjectSchema, create: z.union([ BundleCreateInputObjectSchema, BundleUncheckedCreateInputObjectSchema ]), update: z.union([ BundleUpdateInputObjectSchema, BundleUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.BundleUpsertArgs>;

export const BundleUpsertOneZodSchema = z.object({ select: BundleSelectObjectSchema.optional(), include: BundleIncludeObjectSchema.optional(), where: BundleWhereUniqueInputObjectSchema, create: z.union([ BundleCreateInputObjectSchema, BundleUncheckedCreateInputObjectSchema ]), update: z.union([ BundleUpdateInputObjectSchema, BundleUncheckedUpdateInputObjectSchema ]) }).strict();