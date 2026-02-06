import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleItemUpdateManyMutationInputObjectSchema as BundleItemUpdateManyMutationInputObjectSchema } from './objects/BundleItemUpdateManyMutationInput.schema';
import { BundleItemWhereInputObjectSchema as BundleItemWhereInputObjectSchema } from './objects/BundleItemWhereInput.schema';

export const BundleItemUpdateManySchema: z.ZodType<Prisma.BundleItemUpdateManyArgs> = z.object({ data: BundleItemUpdateManyMutationInputObjectSchema, where: BundleItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BundleItemUpdateManyArgs>;

export const BundleItemUpdateManyZodSchema = z.object({ data: BundleItemUpdateManyMutationInputObjectSchema, where: BundleItemWhereInputObjectSchema.optional() }).strict();