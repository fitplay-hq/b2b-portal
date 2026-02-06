import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleUpdateManyMutationInputObjectSchema as BundleUpdateManyMutationInputObjectSchema } from './objects/BundleUpdateManyMutationInput.schema';
import { BundleWhereInputObjectSchema as BundleWhereInputObjectSchema } from './objects/BundleWhereInput.schema';

export const BundleUpdateManySchema: z.ZodType<Prisma.BundleUpdateManyArgs> = z.object({ data: BundleUpdateManyMutationInputObjectSchema, where: BundleWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BundleUpdateManyArgs>;

export const BundleUpdateManyZodSchema = z.object({ data: BundleUpdateManyMutationInputObjectSchema, where: BundleWhereInputObjectSchema.optional() }).strict();