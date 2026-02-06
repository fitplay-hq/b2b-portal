import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleCreateWithoutPermissionsInputObjectSchema as SystemRoleCreateWithoutPermissionsInputObjectSchema } from './SystemRoleCreateWithoutPermissionsInput.schema';
import { SystemRoleUncheckedCreateWithoutPermissionsInputObjectSchema as SystemRoleUncheckedCreateWithoutPermissionsInputObjectSchema } from './SystemRoleUncheckedCreateWithoutPermissionsInput.schema';
import { SystemRoleCreateOrConnectWithoutPermissionsInputObjectSchema as SystemRoleCreateOrConnectWithoutPermissionsInputObjectSchema } from './SystemRoleCreateOrConnectWithoutPermissionsInput.schema';
import { SystemRoleWhereUniqueInputObjectSchema as SystemRoleWhereUniqueInputObjectSchema } from './SystemRoleWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SystemRoleCreateWithoutPermissionsInputObjectSchema), z.lazy(() => SystemRoleCreateWithoutPermissionsInputObjectSchema).array(), z.lazy(() => SystemRoleUncheckedCreateWithoutPermissionsInputObjectSchema), z.lazy(() => SystemRoleUncheckedCreateWithoutPermissionsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SystemRoleCreateOrConnectWithoutPermissionsInputObjectSchema), z.lazy(() => SystemRoleCreateOrConnectWithoutPermissionsInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => SystemRoleWhereUniqueInputObjectSchema), z.lazy(() => SystemRoleWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const SystemRoleCreateNestedManyWithoutPermissionsInputObjectSchema: z.ZodType<Prisma.SystemRoleCreateNestedManyWithoutPermissionsInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleCreateNestedManyWithoutPermissionsInput>;
export const SystemRoleCreateNestedManyWithoutPermissionsInputObjectZodSchema = makeSchema();
