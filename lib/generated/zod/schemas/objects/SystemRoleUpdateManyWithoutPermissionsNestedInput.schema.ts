import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleCreateWithoutPermissionsInputObjectSchema as SystemRoleCreateWithoutPermissionsInputObjectSchema } from './SystemRoleCreateWithoutPermissionsInput.schema';
import { SystemRoleUncheckedCreateWithoutPermissionsInputObjectSchema as SystemRoleUncheckedCreateWithoutPermissionsInputObjectSchema } from './SystemRoleUncheckedCreateWithoutPermissionsInput.schema';
import { SystemRoleCreateOrConnectWithoutPermissionsInputObjectSchema as SystemRoleCreateOrConnectWithoutPermissionsInputObjectSchema } from './SystemRoleCreateOrConnectWithoutPermissionsInput.schema';
import { SystemRoleUpsertWithWhereUniqueWithoutPermissionsInputObjectSchema as SystemRoleUpsertWithWhereUniqueWithoutPermissionsInputObjectSchema } from './SystemRoleUpsertWithWhereUniqueWithoutPermissionsInput.schema';
import { SystemRoleWhereUniqueInputObjectSchema as SystemRoleWhereUniqueInputObjectSchema } from './SystemRoleWhereUniqueInput.schema';
import { SystemRoleUpdateWithWhereUniqueWithoutPermissionsInputObjectSchema as SystemRoleUpdateWithWhereUniqueWithoutPermissionsInputObjectSchema } from './SystemRoleUpdateWithWhereUniqueWithoutPermissionsInput.schema';
import { SystemRoleUpdateManyWithWhereWithoutPermissionsInputObjectSchema as SystemRoleUpdateManyWithWhereWithoutPermissionsInputObjectSchema } from './SystemRoleUpdateManyWithWhereWithoutPermissionsInput.schema';
import { SystemRoleScalarWhereInputObjectSchema as SystemRoleScalarWhereInputObjectSchema } from './SystemRoleScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SystemRoleCreateWithoutPermissionsInputObjectSchema), z.lazy(() => SystemRoleCreateWithoutPermissionsInputObjectSchema).array(), z.lazy(() => SystemRoleUncheckedCreateWithoutPermissionsInputObjectSchema), z.lazy(() => SystemRoleUncheckedCreateWithoutPermissionsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SystemRoleCreateOrConnectWithoutPermissionsInputObjectSchema), z.lazy(() => SystemRoleCreateOrConnectWithoutPermissionsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => SystemRoleUpsertWithWhereUniqueWithoutPermissionsInputObjectSchema), z.lazy(() => SystemRoleUpsertWithWhereUniqueWithoutPermissionsInputObjectSchema).array()]).optional(),
  set: z.union([z.lazy(() => SystemRoleWhereUniqueInputObjectSchema), z.lazy(() => SystemRoleWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => SystemRoleWhereUniqueInputObjectSchema), z.lazy(() => SystemRoleWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => SystemRoleWhereUniqueInputObjectSchema), z.lazy(() => SystemRoleWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => SystemRoleWhereUniqueInputObjectSchema), z.lazy(() => SystemRoleWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => SystemRoleUpdateWithWhereUniqueWithoutPermissionsInputObjectSchema), z.lazy(() => SystemRoleUpdateWithWhereUniqueWithoutPermissionsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => SystemRoleUpdateManyWithWhereWithoutPermissionsInputObjectSchema), z.lazy(() => SystemRoleUpdateManyWithWhereWithoutPermissionsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => SystemRoleScalarWhereInputObjectSchema), z.lazy(() => SystemRoleScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const SystemRoleUpdateManyWithoutPermissionsNestedInputObjectSchema: z.ZodType<Prisma.SystemRoleUpdateManyWithoutPermissionsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleUpdateManyWithoutPermissionsNestedInput>;
export const SystemRoleUpdateManyWithoutPermissionsNestedInputObjectZodSchema = makeSchema();
