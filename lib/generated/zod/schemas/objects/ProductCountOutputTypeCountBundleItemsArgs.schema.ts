import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemWhereInputObjectSchema as BundleItemWhereInputObjectSchema } from './BundleItemWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleItemWhereInputObjectSchema).optional()
}).strict();
export const ProductCountOutputTypeCountBundleItemsArgsObjectSchema = makeSchema();
export const ProductCountOutputTypeCountBundleItemsArgsObjectZodSchema = makeSchema();
