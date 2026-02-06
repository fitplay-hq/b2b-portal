import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleWhereInputObjectSchema as BundleWhereInputObjectSchema } from './BundleWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => BundleWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => BundleWhereInputObjectSchema).optional()
}).strict();
export const BundleScalarRelationFilterObjectSchema: z.ZodType<Prisma.BundleScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.BundleScalarRelationFilter>;
export const BundleScalarRelationFilterObjectZodSchema = makeSchema();
