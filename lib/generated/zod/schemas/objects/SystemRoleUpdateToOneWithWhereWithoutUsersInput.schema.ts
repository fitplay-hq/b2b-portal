import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleWhereInputObjectSchema as SystemRoleWhereInputObjectSchema } from './SystemRoleWhereInput.schema';
import { SystemRoleUpdateWithoutUsersInputObjectSchema as SystemRoleUpdateWithoutUsersInputObjectSchema } from './SystemRoleUpdateWithoutUsersInput.schema';
import { SystemRoleUncheckedUpdateWithoutUsersInputObjectSchema as SystemRoleUncheckedUpdateWithoutUsersInputObjectSchema } from './SystemRoleUncheckedUpdateWithoutUsersInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SystemRoleWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => SystemRoleUpdateWithoutUsersInputObjectSchema), z.lazy(() => SystemRoleUncheckedUpdateWithoutUsersInputObjectSchema)])
}).strict();
export const SystemRoleUpdateToOneWithWhereWithoutUsersInputObjectSchema: z.ZodType<Prisma.SystemRoleUpdateToOneWithWhereWithoutUsersInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleUpdateToOneWithWhereWithoutUsersInput>;
export const SystemRoleUpdateToOneWithWhereWithoutUsersInputObjectZodSchema = makeSchema();
