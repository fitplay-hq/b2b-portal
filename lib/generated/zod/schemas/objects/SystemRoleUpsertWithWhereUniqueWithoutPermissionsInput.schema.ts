import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleWhereUniqueInputObjectSchema as SystemRoleWhereUniqueInputObjectSchema } from './SystemRoleWhereUniqueInput.schema';
import { SystemRoleUpdateWithoutPermissionsInputObjectSchema as SystemRoleUpdateWithoutPermissionsInputObjectSchema } from './SystemRoleUpdateWithoutPermissionsInput.schema';
import { SystemRoleUncheckedUpdateWithoutPermissionsInputObjectSchema as SystemRoleUncheckedUpdateWithoutPermissionsInputObjectSchema } from './SystemRoleUncheckedUpdateWithoutPermissionsInput.schema';
import { SystemRoleCreateWithoutPermissionsInputObjectSchema as SystemRoleCreateWithoutPermissionsInputObjectSchema } from './SystemRoleCreateWithoutPermissionsInput.schema';
import { SystemRoleUncheckedCreateWithoutPermissionsInputObjectSchema as SystemRoleUncheckedCreateWithoutPermissionsInputObjectSchema } from './SystemRoleUncheckedCreateWithoutPermissionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SystemRoleWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => SystemRoleUpdateWithoutPermissionsInputObjectSchema), z.lazy(() => SystemRoleUncheckedUpdateWithoutPermissionsInputObjectSchema)]),
  create: z.union([z.lazy(() => SystemRoleCreateWithoutPermissionsInputObjectSchema), z.lazy(() => SystemRoleUncheckedCreateWithoutPermissionsInputObjectSchema)])
}).strict();
export const SystemRoleUpsertWithWhereUniqueWithoutPermissionsInputObjectSchema: z.ZodType<Prisma.SystemRoleUpsertWithWhereUniqueWithoutPermissionsInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleUpsertWithWhereUniqueWithoutPermissionsInput>;
export const SystemRoleUpsertWithWhereUniqueWithoutPermissionsInputObjectZodSchema = makeSchema();
