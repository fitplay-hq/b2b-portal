import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleUpdateWithoutUsersInputObjectSchema as SystemRoleUpdateWithoutUsersInputObjectSchema } from './SystemRoleUpdateWithoutUsersInput.schema';
import { SystemRoleUncheckedUpdateWithoutUsersInputObjectSchema as SystemRoleUncheckedUpdateWithoutUsersInputObjectSchema } from './SystemRoleUncheckedUpdateWithoutUsersInput.schema';
import { SystemRoleCreateWithoutUsersInputObjectSchema as SystemRoleCreateWithoutUsersInputObjectSchema } from './SystemRoleCreateWithoutUsersInput.schema';
import { SystemRoleUncheckedCreateWithoutUsersInputObjectSchema as SystemRoleUncheckedCreateWithoutUsersInputObjectSchema } from './SystemRoleUncheckedCreateWithoutUsersInput.schema';
import { SystemRoleWhereInputObjectSchema as SystemRoleWhereInputObjectSchema } from './SystemRoleWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => SystemRoleUpdateWithoutUsersInputObjectSchema), z.lazy(() => SystemRoleUncheckedUpdateWithoutUsersInputObjectSchema)]),
  create: z.union([z.lazy(() => SystemRoleCreateWithoutUsersInputObjectSchema), z.lazy(() => SystemRoleUncheckedCreateWithoutUsersInputObjectSchema)]),
  where: z.lazy(() => SystemRoleWhereInputObjectSchema).optional()
}).strict();
export const SystemRoleUpsertWithoutUsersInputObjectSchema: z.ZodType<Prisma.SystemRoleUpsertWithoutUsersInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleUpsertWithoutUsersInput>;
export const SystemRoleUpsertWithoutUsersInputObjectZodSchema = makeSchema();
