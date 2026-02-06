import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleWhereUniqueInputObjectSchema as SystemRoleWhereUniqueInputObjectSchema } from './SystemRoleWhereUniqueInput.schema';
import { SystemRoleCreateWithoutUsersInputObjectSchema as SystemRoleCreateWithoutUsersInputObjectSchema } from './SystemRoleCreateWithoutUsersInput.schema';
import { SystemRoleUncheckedCreateWithoutUsersInputObjectSchema as SystemRoleUncheckedCreateWithoutUsersInputObjectSchema } from './SystemRoleUncheckedCreateWithoutUsersInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SystemRoleWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => SystemRoleCreateWithoutUsersInputObjectSchema), z.lazy(() => SystemRoleUncheckedCreateWithoutUsersInputObjectSchema)])
}).strict();
export const SystemRoleCreateOrConnectWithoutUsersInputObjectSchema: z.ZodType<Prisma.SystemRoleCreateOrConnectWithoutUsersInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleCreateOrConnectWithoutUsersInput>;
export const SystemRoleCreateOrConnectWithoutUsersInputObjectZodSchema = makeSchema();
