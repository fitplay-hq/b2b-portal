import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleWhereUniqueInputObjectSchema as SystemRoleWhereUniqueInputObjectSchema } from './SystemRoleWhereUniqueInput.schema';
import { SystemRoleCreateWithoutPermissionsInputObjectSchema as SystemRoleCreateWithoutPermissionsInputObjectSchema } from './SystemRoleCreateWithoutPermissionsInput.schema';
import { SystemRoleUncheckedCreateWithoutPermissionsInputObjectSchema as SystemRoleUncheckedCreateWithoutPermissionsInputObjectSchema } from './SystemRoleUncheckedCreateWithoutPermissionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SystemRoleWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => SystemRoleCreateWithoutPermissionsInputObjectSchema), z.lazy(() => SystemRoleUncheckedCreateWithoutPermissionsInputObjectSchema)])
}).strict();
export const SystemRoleCreateOrConnectWithoutPermissionsInputObjectSchema: z.ZodType<Prisma.SystemRoleCreateOrConnectWithoutPermissionsInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleCreateOrConnectWithoutPermissionsInput>;
export const SystemRoleCreateOrConnectWithoutPermissionsInputObjectZodSchema = makeSchema();
