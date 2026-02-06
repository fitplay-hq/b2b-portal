import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleOrderItemSelectObjectSchema as BundleOrderItemSelectObjectSchema } from './objects/BundleOrderItemSelect.schema';
import { BundleOrderItemUpdateManyMutationInputObjectSchema as BundleOrderItemUpdateManyMutationInputObjectSchema } from './objects/BundleOrderItemUpdateManyMutationInput.schema';
import { BundleOrderItemWhereInputObjectSchema as BundleOrderItemWhereInputObjectSchema } from './objects/BundleOrderItemWhereInput.schema';

export const BundleOrderItemUpdateManyAndReturnSchema: z.ZodType<Prisma.BundleOrderItemUpdateManyAndReturnArgs> = z.object({ select: BundleOrderItemSelectObjectSchema.optional(), data: BundleOrderItemUpdateManyMutationInputObjectSchema, where: BundleOrderItemWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.BundleOrderItemUpdateManyAndReturnArgs>;

export const BundleOrderItemUpdateManyAndReturnZodSchema = z.object({ select: BundleOrderItemSelectObjectSchema.optional(), data: BundleOrderItemUpdateManyMutationInputObjectSchema, where: BundleOrderItemWhereInputObjectSchema.optional() }).strict();