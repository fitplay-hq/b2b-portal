import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemPermissionCreateWithoutRolesInputObjectSchema as SystemPermissionCreateWithoutRolesInputObjectSchema } from './SystemPermissionCreateWithoutRolesInput.schema';
import { SystemPermissionUncheckedCreateWithoutRolesInputObjectSchema as SystemPermissionUncheckedCreateWithoutRolesInputObjectSchema } from './SystemPermissionUncheckedCreateWithoutRolesInput.schema';
import { SystemPermissionCreateOrConnectWithoutRolesInputObjectSchema as SystemPermissionCreateOrConnectWithoutRolesInputObjectSchema } from './SystemPermissionCreateOrConnectWithoutRolesInput.schema';
import { SystemPermissionUpsertWithWhereUniqueWithoutRolesInputObjectSchema as SystemPermissionUpsertWithWhereUniqueWithoutRolesInputObjectSchema } from './SystemPermissionUpsertWithWhereUniqueWithoutRolesInput.schema';
import { SystemPermissionWhereUniqueInputObjectSchema as SystemPermissionWhereUniqueInputObjectSchema } from './SystemPermissionWhereUniqueInput.schema';
import { SystemPermissionUpdateWithWhereUniqueWithoutRolesInputObjectSchema as SystemPermissionUpdateWithWhereUniqueWithoutRolesInputObjectSchema } from './SystemPermissionUpdateWithWhereUniqueWithoutRolesInput.schema';
import { SystemPermissionUpdateManyWithWhereWithoutRolesInputObjectSchema as SystemPermissionUpdateManyWithWhereWithoutRolesInputObjectSchema } from './SystemPermissionUpdateManyWithWhereWithoutRolesInput.schema';
import { SystemPermissionScalarWhereInputObjectSchema as SystemPermissionScalarWhereInputObjectSchema } from './SystemPermissionScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SystemPermissionCreateWithoutRolesInputObjectSchema), z.lazy(() => SystemPermissionCreateWithoutRolesInputObjectSchema).array(), z.lazy(() => SystemPermissionUncheckedCreateWithoutRolesInputObjectSchema), z.lazy(() => SystemPermissionUncheckedCreateWithoutRolesInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SystemPermissionCreateOrConnectWithoutRolesInputObjectSchema), z.lazy(() => SystemPermissionCreateOrConnectWithoutRolesInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => SystemPermissionUpsertWithWhereUniqueWithoutRolesInputObjectSchema), z.lazy(() => SystemPermissionUpsertWithWhereUniqueWithoutRolesInputObjectSchema).array()]).optional(),
  set: z.union([z.lazy(() => SystemPermissionWhereUniqueInputObjectSchema), z.lazy(() => SystemPermissionWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => SystemPermissionWhereUniqueInputObjectSchema), z.lazy(() => SystemPermissionWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => SystemPermissionWhereUniqueInputObjectSchema), z.lazy(() => SystemPermissionWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => SystemPermissionWhereUniqueInputObjectSchema), z.lazy(() => SystemPermissionWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => SystemPermissionUpdateWithWhereUniqueWithoutRolesInputObjectSchema), z.lazy(() => SystemPermissionUpdateWithWhereUniqueWithoutRolesInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => SystemPermissionUpdateManyWithWhereWithoutRolesInputObjectSchema), z.lazy(() => SystemPermissionUpdateManyWithWhereWithoutRolesInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => SystemPermissionScalarWhereInputObjectSchema), z.lazy(() => SystemPermissionScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const SystemPermissionUncheckedUpdateManyWithoutRolesNestedInputObjectSchema: z.ZodType<Prisma.SystemPermissionUncheckedUpdateManyWithoutRolesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionUncheckedUpdateManyWithoutRolesNestedInput>;
export const SystemPermissionUncheckedUpdateManyWithoutRolesNestedInputObjectZodSchema = makeSchema();
