import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemPermissionScalarWhereInputObjectSchema as SystemPermissionScalarWhereInputObjectSchema } from './SystemPermissionScalarWhereInput.schema';
import { SystemPermissionUpdateManyMutationInputObjectSchema as SystemPermissionUpdateManyMutationInputObjectSchema } from './SystemPermissionUpdateManyMutationInput.schema';
import { SystemPermissionUncheckedUpdateManyWithoutRolesInputObjectSchema as SystemPermissionUncheckedUpdateManyWithoutRolesInputObjectSchema } from './SystemPermissionUncheckedUpdateManyWithoutRolesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SystemPermissionScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => SystemPermissionUpdateManyMutationInputObjectSchema), z.lazy(() => SystemPermissionUncheckedUpdateManyWithoutRolesInputObjectSchema)])
}).strict();
export const SystemPermissionUpdateManyWithWhereWithoutRolesInputObjectSchema: z.ZodType<Prisma.SystemPermissionUpdateManyWithWhereWithoutRolesInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionUpdateManyWithWhereWithoutRolesInput>;
export const SystemPermissionUpdateManyWithWhereWithoutRolesInputObjectZodSchema = makeSchema();
