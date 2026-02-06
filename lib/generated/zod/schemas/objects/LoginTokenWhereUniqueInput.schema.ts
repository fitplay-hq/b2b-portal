import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  token: z.string().optional()
}).strict();
export const LoginTokenWhereUniqueInputObjectSchema: z.ZodType<Prisma.LoginTokenWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.LoginTokenWhereUniqueInput>;
export const LoginTokenWhereUniqueInputObjectZodSchema = makeSchema();
