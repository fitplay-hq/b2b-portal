import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleSelectObjectSchema as BundleSelectObjectSchema } from './objects/BundleSelect.schema';
import { BundleIncludeObjectSchema as BundleIncludeObjectSchema } from './objects/BundleInclude.schema';
import { BundleCreateInputObjectSchema as BundleCreateInputObjectSchema } from './objects/BundleCreateInput.schema';
import { BundleUncheckedCreateInputObjectSchema as BundleUncheckedCreateInputObjectSchema } from './objects/BundleUncheckedCreateInput.schema';

export const BundleCreateOneSchema: z.ZodType<Prisma.BundleCreateArgs> = z.object({ select: BundleSelectObjectSchema.optional(), include: BundleIncludeObjectSchema.optional(), data: z.union([BundleCreateInputObjectSchema, BundleUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.BundleCreateArgs>;

export const BundleCreateOneZodSchema = z.object({ select: BundleSelectObjectSchema.optional(), include: BundleIncludeObjectSchema.optional(), data: z.union([BundleCreateInputObjectSchema, BundleUncheckedCreateInputObjectSchema]) }).strict();