import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemWhereInputObjectSchema as BundleItemWhereInputObjectSchema } from './BundleItemWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => BundleItemWhereInputObjectSchema).optional(),
  some: z.lazy(() => BundleItemWhereInputObjectSchema).optional(),
  none: z.lazy(() => BundleItemWhereInputObjectSchema).optional()
}).strict();
export const BundleItemListRelationFilterObjectSchema: z.ZodType<Prisma.BundleItemListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemListRelationFilter>;
export const BundleItemListRelationFilterObjectZodSchema = makeSchema();
