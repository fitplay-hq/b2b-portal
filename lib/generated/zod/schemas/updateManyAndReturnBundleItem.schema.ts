import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleItemSelectObjectSchema as BundleItemSelectObjectSchema } from './objects/BundleItemSelect.schema';
import { BundleItemUpdateManyMutationInputObjectSchema as BundleItemUpdateManyMutationInputObjectSchema } from './objects/BundleItemUpdateManyMutationInput.schema';
import { BundleItemWhereInputObjectSchema as BundleItemWhereInputObjectSchema } from './objects/BundleItemWhereInput.schema';

export const BundleItemUpdateManyAndReturnSchema: z.ZodType<Prisma.BundleItemUpdateManyAndReturnArgs> = z.object({ select: BundleItemSelectObjectSchema.optional(), data: BundleItemUpdateManyMutationInputObjectSchema, where: BundleItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BundleItemUpdateManyAndReturnArgs>;

export const BundleItemUpdateManyAndReturnZodSchema = z.object({ select: BundleItemSelectObjectSchema.optional(), data: BundleItemUpdateManyMutationInputObjectSchema, where: BundleItemWhereInputObjectSchema.optional() }).strict();