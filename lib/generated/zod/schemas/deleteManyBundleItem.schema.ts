import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleItemWhereInputObjectSchema as BundleItemWhereInputObjectSchema } from './objects/BundleItemWhereInput.schema';

export const BundleItemDeleteManySchema: z.ZodType<Prisma.BundleItemDeleteManyArgs> = z.object({ where: BundleItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BundleItemDeleteManyArgs>;

export const BundleItemDeleteManyZodSchema = z.object({ where: BundleItemWhereInputObjectSchema.optional() }).strict();