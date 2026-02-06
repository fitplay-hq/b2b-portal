import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  clientId: z.string(),
  productId: z.string()
}).strict();
export const ClientProductClientIdProductIdCompoundUniqueInputObjectSchema: z.ZodType<Prisma.ClientProductClientIdProductIdCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductClientIdProductIdCompoundUniqueInput>;
export const ClientProductClientIdProductIdCompoundUniqueInputObjectZodSchema = makeSchema();
