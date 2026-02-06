import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemPermissionWhereUniqueInputObjectSchema as SystemPermissionWhereUniqueInputObjectSchema } from './SystemPermissionWhereUniqueInput.schema';
import { SystemPermissionUpdateWithoutRolesInputObjectSchema as SystemPermissionUpdateWithoutRolesInputObjectSchema } from './SystemPermissionUpdateWithoutRolesInput.schema';
import { SystemPermissionUncheckedUpdateWithoutRolesInputObjectSchema as SystemPermissionUncheckedUpdateWithoutRolesInputObjectSchema } from './SystemPermissionUncheckedUpdateWithoutRolesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SystemPermissionWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => SystemPermissionUpdateWithoutRolesInputObjectSchema), z.lazy(() => SystemPermissionUncheckedUpdateWithoutRolesInputObjectSchema)])
}).strict();
export const SystemPermissionUpdateWithWhereUniqueWithoutRolesInputObjectSchema: z.ZodType<Prisma.SystemPermissionUpdateWithWhereUniqueWithoutRolesInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionUpdateWithWhereUniqueWithoutRolesInput>;
export const SystemPermissionUpdateWithWhereUniqueWithoutRolesInputObjectZodSchema = makeSchema();
