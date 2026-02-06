import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCreateManySubCategoryInputObjectSchema as ProductCreateManySubCategoryInputObjectSchema } from './ProductCreateManySubCategoryInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => ProductCreateManySubCategoryInputObjectSchema), z.lazy(() => ProductCreateManySubCategoryInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ProductCreateManySubCategoryInputEnvelopeObjectSchema: z.ZodType<Prisma.ProductCreateManySubCategoryInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateManySubCategoryInputEnvelope>;
export const ProductCreateManySubCategoryInputEnvelopeObjectZodSchema = makeSchema();
