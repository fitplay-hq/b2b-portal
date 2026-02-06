import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleWhereInputObjectSchema as BundleWhereInputObjectSchema } from './BundleWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => BundleWhereInputObjectSchema).optional(),
  some: z.lazy(() => BundleWhereInputObjectSchema).optional(),
  none: z.lazy(() => BundleWhereInputObjectSchema).optional()
}).strict();
export const BundleListRelationFilterObjectSchema: z.ZodType<Prisma.BundleListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.BundleListRelationFilter>;
export const BundleListRelationFilterObjectZodSchema = makeSchema();
