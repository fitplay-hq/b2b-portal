import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientProductWhereInputObjectSchema as ClientProductWhereInputObjectSchema } from './ClientProductWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ClientProductWhereInputObjectSchema).optional()
}).strict();
export const ClientCountOutputTypeCountProductsArgsObjectSchema = makeSchema();
export const ClientCountOutputTypeCountProductsArgsObjectZodSchema = makeSchema();
