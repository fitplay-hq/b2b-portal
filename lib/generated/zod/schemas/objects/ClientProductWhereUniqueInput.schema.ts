import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientProductClientIdProductIdCompoundUniqueInputObjectSchema as ClientProductClientIdProductIdCompoundUniqueInputObjectSchema } from './ClientProductClientIdProductIdCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  clientId_productId: z.lazy(() => ClientProductClientIdProductIdCompoundUniqueInputObjectSchema).optional()
}).strict();
export const ClientProductWhereUniqueInputObjectSchema: z.ZodType<Prisma.ClientProductWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductWhereUniqueInput>;
export const ClientProductWhereUniqueInputObjectZodSchema = makeSchema();
