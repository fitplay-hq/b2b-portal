import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleWhereUniqueInputObjectSchema as SystemRoleWhereUniqueInputObjectSchema } from './SystemRoleWhereUniqueInput.schema';
import { SystemRoleUpdateWithoutPermissionsInputObjectSchema as SystemRoleUpdateWithoutPermissionsInputObjectSchema } from './SystemRoleUpdateWithoutPermissionsInput.schema';
import { SystemRoleUncheckedUpdateWithoutPermissionsInputObjectSchema as SystemRoleUncheckedUpdateWithoutPermissionsInputObjectSchema } from './SystemRoleUncheckedUpdateWithoutPermissionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SystemRoleWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => SystemRoleUpdateWithoutPermissionsInputObjectSchema), z.lazy(() => SystemRoleUncheckedUpdateWithoutPermissionsInputObjectSchema)])
}).strict();
export const SystemRoleUpdateWithWhereUniqueWithoutPermissionsInputObjectSchema: z.ZodType<Prisma.SystemRoleUpdateWithWhereUniqueWithoutPermissionsInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleUpdateWithWhereUniqueWithoutPermissionsInput>;
export const SystemRoleUpdateWithWhereUniqueWithoutPermissionsInputObjectZodSchema = makeSchema();
