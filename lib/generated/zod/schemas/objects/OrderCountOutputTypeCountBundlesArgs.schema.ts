import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleWhereInputObjectSchema as BundleWhereInputObjectSchema } from './BundleWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleWhereInputObjectSchema).optional()
}).strict();
export const OrderCountOutputTypeCountBundlesArgsObjectSchema = makeSchema();
export const OrderCountOutputTypeCountBundlesArgsObjectZodSchema = makeSchema();
