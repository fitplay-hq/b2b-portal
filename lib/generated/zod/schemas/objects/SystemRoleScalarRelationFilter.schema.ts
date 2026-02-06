import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleWhereInputObjectSchema as SystemRoleWhereInputObjectSchema } from './SystemRoleWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => SystemRoleWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => SystemRoleWhereInputObjectSchema).optional()
}).strict();
export const SystemRoleScalarRelationFilterObjectSchema: z.ZodType<Prisma.SystemRoleScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleScalarRelationFilter>;
export const SystemRoleScalarRelationFilterObjectZodSchema = makeSchema();
