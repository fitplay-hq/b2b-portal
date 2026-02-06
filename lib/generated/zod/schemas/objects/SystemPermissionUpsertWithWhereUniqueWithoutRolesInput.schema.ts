import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemPermissionWhereUniqueInputObjectSchema as SystemPermissionWhereUniqueInputObjectSchema } from './SystemPermissionWhereUniqueInput.schema';
import { SystemPermissionUpdateWithoutRolesInputObjectSchema as SystemPermissionUpdateWithoutRolesInputObjectSchema } from './SystemPermissionUpdateWithoutRolesInput.schema';
import { SystemPermissionUncheckedUpdateWithoutRolesInputObjectSchema as SystemPermissionUncheckedUpdateWithoutRolesInputObjectSchema } from './SystemPermissionUncheckedUpdateWithoutRolesInput.schema';
import { SystemPermissionCreateWithoutRolesInputObjectSchema as SystemPermissionCreateWithoutRolesInputObjectSchema } from './SystemPermissionCreateWithoutRolesInput.schema';
import { SystemPermissionUncheckedCreateWithoutRolesInputObjectSchema as SystemPermissionUncheckedCreateWithoutRolesInputObjectSchema } from './SystemPermissionUncheckedCreateWithoutRolesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SystemPermissionWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => SystemPermissionUpdateWithoutRolesInputObjectSchema), z.lazy(() => SystemPermissionUncheckedUpdateWithoutRolesInputObjectSchema)]),
  create: z.union([z.lazy(() => SystemPermissionCreateWithoutRolesInputObjectSchema), z.lazy(() => SystemPermissionUncheckedCreateWithoutRolesInputObjectSchema)])
}).strict();
export const SystemPermissionUpsertWithWhereUniqueWithoutRolesInputObjectSchema: z.ZodType<Prisma.SystemPermissionUpsertWithWhereUniqueWithoutRolesInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionUpsertWithWhereUniqueWithoutRolesInput>;
export const SystemPermissionUpsertWithWhereUniqueWithoutRolesInputObjectZodSchema = makeSchema();
