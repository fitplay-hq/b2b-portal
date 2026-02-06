import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  shortCode: z.string().max(10).optional()
}).strict();
export const SubCategoryWhereUniqueInputObjectSchema: z.ZodType<Prisma.SubCategoryWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryWhereUniqueInput>;
export const SubCategoryWhereUniqueInputObjectZodSchema = makeSchema();
