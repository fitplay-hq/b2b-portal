import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  set: z.string().array()
}).strict();
export const ProductCreateinventoryLogsInputObjectSchema: z.ZodType<Prisma.ProductCreateinventoryLogsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateinventoryLogsInput>;
export const ProductCreateinventoryLogsInputObjectZodSchema = makeSchema();
