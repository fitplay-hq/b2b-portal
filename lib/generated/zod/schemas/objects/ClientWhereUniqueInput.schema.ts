import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional()
}).strict();
export const ClientWhereUniqueInputObjectSchema: z.ZodType<Prisma.ClientWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientWhereUniqueInput>;
export const ClientWhereUniqueInputObjectZodSchema = makeSchema();
