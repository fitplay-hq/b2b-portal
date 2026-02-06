import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleOrderItemWhereInputObjectSchema as BundleOrderItemWhereInputObjectSchema } from './objects/BundleOrderItemWhereInput.schema';

export const BundleOrderItemDeleteManySchema: z.ZodType<Prisma.BundleOrderItemDeleteManyArgs> = z.object({ where: BundleOrderItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BundleOrderItemDeleteManyArgs>;

export const BundleOrderItemDeleteManyZodSchema = z.object({ where: BundleOrderItemWhereInputObjectSchema.optional() }).strict();