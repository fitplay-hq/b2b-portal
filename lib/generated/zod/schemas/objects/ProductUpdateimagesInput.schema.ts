import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  set: z.string().array().optional(),
  push: z.union([z.string(), z.string().array()]).optional()
}).strict();
export const ProductUpdateimagesInputObjectSchema: z.ZodType<Prisma.ProductUpdateimagesInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateimagesInput>;
export const ProductUpdateimagesInputObjectZodSchema = makeSchema();
