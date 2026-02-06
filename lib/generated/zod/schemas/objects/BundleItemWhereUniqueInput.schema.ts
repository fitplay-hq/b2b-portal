import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const BundleItemWhereUniqueInputObjectSchema: z.ZodType<Prisma.BundleItemWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemWhereUniqueInput>;
export const BundleItemWhereUniqueInputObjectZodSchema = makeSchema();
