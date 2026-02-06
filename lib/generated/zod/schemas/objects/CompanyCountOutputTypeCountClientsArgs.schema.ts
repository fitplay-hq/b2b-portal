import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientWhereInputObjectSchema as ClientWhereInputObjectSchema } from './ClientWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ClientWhereInputObjectSchema).optional()
}).strict();
export const CompanyCountOutputTypeCountClientsArgsObjectSchema = makeSchema();
export const CompanyCountOutputTypeCountClientsArgsObjectZodSchema = makeSchema();
