import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemWhereInputObjectSchema as BundleOrderItemWhereInputObjectSchema } from './BundleOrderItemWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => BundleOrderItemWhereInputObjectSchema).optional(),
  some: z.lazy(() => BundleOrderItemWhereInputObjectSchema).optional(),
  none: z.lazy(() => BundleOrderItemWhereInputObjectSchema).optional()
}).strict();
export const BundleOrderItemListRelationFilterObjectSchema: z.ZodType<Prisma.BundleOrderItemListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemListRelationFilter>;
export const BundleOrderItemListRelationFilterObjectZodSchema = makeSchema();
