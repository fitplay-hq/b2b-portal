import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  set: z.string().array().optional(),
  push: z.union([z.string(), z.string().array()]).optional()
}).strict();
export const ProductUpdateinventoryLogsInputObjectSchema: z.ZodType<Prisma.ProductUpdateinventoryLogsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateinventoryLogsInput>;
export const ProductUpdateinventoryLogsInputObjectZodSchema = makeSchema();
