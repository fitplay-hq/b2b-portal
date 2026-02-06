import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleArgsObjectSchema as SystemRoleArgsObjectSchema } from './SystemRoleArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  password: z.boolean().optional(),
  isActive: z.boolean().optional(),
  role: z.union([z.boolean(), z.lazy(() => SystemRoleArgsObjectSchema)]).optional(),
  roleId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const SystemUserSelectObjectSchema: z.ZodType<Prisma.SystemUserSelect> = makeSchema() as unknown as z.ZodType<Prisma.SystemUserSelect>;
export const SystemUserSelectObjectZodSchema = makeSchema();
