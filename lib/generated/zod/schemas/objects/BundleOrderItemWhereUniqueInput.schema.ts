import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const BundleOrderItemWhereUniqueInputObjectSchema: z.ZodType<Prisma.BundleOrderItemWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemWhereUniqueInput>;
export const BundleOrderItemWhereUniqueInputObjectZodSchema = makeSchema();
