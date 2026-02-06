import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemPermissionWhereUniqueInputObjectSchema as SystemPermissionWhereUniqueInputObjectSchema } from './SystemPermissionWhereUniqueInput.schema';
import { SystemPermissionCreateWithoutRolesInputObjectSchema as SystemPermissionCreateWithoutRolesInputObjectSchema } from './SystemPermissionCreateWithoutRolesInput.schema';
import { SystemPermissionUncheckedCreateWithoutRolesInputObjectSchema as SystemPermissionUncheckedCreateWithoutRolesInputObjectSchema } from './SystemPermissionUncheckedCreateWithoutRolesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SystemPermissionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => SystemPermissionCreateWithoutRolesInputObjectSchema), z.lazy(() => SystemPermissionUncheckedCreateWithoutRolesInputObjectSchema)])
}).strict();
export const SystemPermissionCreateOrConnectWithoutRolesInputObjectSchema: z.ZodType<Prisma.SystemPermissionCreateOrConnectWithoutRolesInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionCreateOrConnectWithoutRolesInput>;
export const SystemPermissionCreateOrConnectWithoutRolesInputObjectZodSchema = makeSchema();
