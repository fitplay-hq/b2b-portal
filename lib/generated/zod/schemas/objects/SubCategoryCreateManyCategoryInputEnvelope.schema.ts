import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SubCategoryCreateManyCategoryInputObjectSchema as SubCategoryCreateManyCategoryInputObjectSchema } from './SubCategoryCreateManyCategoryInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => SubCategoryCreateManyCategoryInputObjectSchema), z.lazy(() => SubCategoryCreateManyCategoryInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const SubCategoryCreateManyCategoryInputEnvelopeObjectSchema: z.ZodType<Prisma.SubCategoryCreateManyCategoryInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryCreateManyCategoryInputEnvelope>;
export const SubCategoryCreateManyCategoryInputEnvelopeObjectZodSchema = makeSchema();
