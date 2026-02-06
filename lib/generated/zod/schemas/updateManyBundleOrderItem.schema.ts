import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleOrderItemUpdateManyMutationInputObjectSchema as BundleOrderItemUpdateManyMutationInputObjectSchema } from './objects/BundleOrderItemUpdateManyMutationInput.schema';
import { BundleOrderItemWhereInputObjectSchema as BundleOrderItemWhereInputObjectSchema } from './objects/BundleOrderItemWhereInput.schema';

export const BundleOrderItemUpdateManySchema: z.ZodType<Prisma.BundleOrderItemUpdateManyArgs> = z.object({ data: BundleOrderItemUpdateManyMutationInputObjectSchema, where: BundleOrderItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BundleOrderItemUpdateManyArgs>;

export const BundleOrderItemUpdateManyZodSchema = z.object({ data: BundleOrderItemUpdateManyMutationInputObjectSchema, where: BundleOrderItemWhereInputObjectSchema.optional() }).strict();