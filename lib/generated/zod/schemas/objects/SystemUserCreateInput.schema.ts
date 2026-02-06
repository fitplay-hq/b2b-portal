import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleCreateNestedOneWithoutUsersInputObjectSchema as SystemRoleCreateNestedOneWithoutUsersInputObjectSchema } from './SystemRoleCreateNestedOneWithoutUsersInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().max(100),
  email: z.string(),
  password: z.string(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  role: z.lazy(() => SystemRoleCreateNestedOneWithoutUsersInputObjectSchema)
}).strict();
export const SystemUserCreateInputObjectSchema: z.ZodType<Prisma.SystemUserCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemUserCreateInput>;
export const SystemUserCreateInputObjectZodSchema = makeSchema();
