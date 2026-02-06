import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleWhereInputObjectSchema as BundleWhereInputObjectSchema } from './objects/BundleWhereInput.schema';

export const BundleDeleteManySchema: z.ZodType<Prisma.BundleDeleteManyArgs> = z.object({ where: BundleWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BundleDeleteManyArgs>;

export const BundleDeleteManyZodSchema = z.object({ where: BundleWhereInputObjectSchema.optional() }).strict();