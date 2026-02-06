import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemPermissionCreateWithoutRolesInputObjectSchema as SystemPermissionCreateWithoutRolesInputObjectSchema } from './SystemPermissionCreateWithoutRolesInput.schema';
import { SystemPermissionUncheckedCreateWithoutRolesInputObjectSchema as SystemPermissionUncheckedCreateWithoutRolesInputObjectSchema } from './SystemPermissionUncheckedCreateWithoutRolesInput.schema';
import { SystemPermissionCreateOrConnectWithoutRolesInputObjectSchema as SystemPermissionCreateOrConnectWithoutRolesInputObjectSchema } from './SystemPermissionCreateOrConnectWithoutRolesInput.schema';
import { SystemPermissionWhereUniqueInputObjectSchema as SystemPermissionWhereUniqueInputObjectSchema } from './SystemPermissionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SystemPermissionCreateWithoutRolesInputObjectSchema), z.lazy(() => SystemPermissionCreateWithoutRolesInputObjectSchema).array(), z.lazy(() => SystemPermissionUncheckedCreateWithoutRolesInputObjectSchema), z.lazy(() => SystemPermissionUncheckedCreateWithoutRolesInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SystemPermissionCreateOrConnectWithoutRolesInputObjectSchema), z.lazy(() => SystemPermissionCreateOrConnectWithoutRolesInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => SystemPermissionWhereUniqueInputObjectSchema), z.lazy(() => SystemPermissionWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const SystemPermissionUncheckedCreateNestedManyWithoutRolesInputObjectSchema: z.ZodType<Prisma.SystemPermissionUncheckedCreateNestedManyWithoutRolesInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionUncheckedCreateNestedManyWithoutRolesInput>;
export const SystemPermissionUncheckedCreateNestedManyWithoutRolesInputObjectZodSchema = makeSchema();
