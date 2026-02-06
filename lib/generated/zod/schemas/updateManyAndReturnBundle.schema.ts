import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleSelectObjectSchema as BundleSelectObjectSchema } from './objects/BundleSelect.schema';
import { BundleUpdateManyMutationInputObjectSchema as BundleUpdateManyMutationInputObjectSchema } from './objects/BundleUpdateManyMutationInput.schema';
import { BundleWhereInputObjectSchema as BundleWhereInputObjectSchema } from './objects/BundleWhereInput.schema';

export const BundleUpdateManyAndReturnSchema: z.ZodType<Prisma.BundleUpdateManyAndReturnArgs> = z.object({ select: BundleSelectObjectSchema.optional(), data: BundleUpdateManyMutationInputObjectSchema, where: BundleWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BundleUpdateManyAndReturnArgs>;

export const BundleUpdateManyAndReturnZodSchema = z.object({ select: BundleSelectObjectSchema.optional(), data: BundleUpdateManyMutationInputObjectSchema, where: BundleWhereInputObjectSchema.optional() }).strict();