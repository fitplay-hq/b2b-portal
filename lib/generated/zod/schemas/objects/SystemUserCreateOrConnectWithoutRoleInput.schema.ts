import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemUserWhereUniqueInputObjectSchema as SystemUserWhereUniqueInputObjectSchema } from './SystemUserWhereUniqueInput.schema';
import { SystemUserCreateWithoutRoleInputObjectSchema as SystemUserCreateWithoutRoleInputObjectSchema } from './SystemUserCreateWithoutRoleInput.schema';
import { SystemUserUncheckedCreateWithoutRoleInputObjectSchema as SystemUserUncheckedCreateWithoutRoleInputObjectSchema } from './SystemUserUncheckedCreateWithoutRoleInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SystemUserWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => SystemUserCreateWithoutRoleInputObjectSchema), z.lazy(() => SystemUserUncheckedCreateWithoutRoleInputObjectSchema)])
}).strict();
export const SystemUserCreateOrConnectWithoutRoleInputObjectSchema: z.ZodType<Prisma.SystemUserCreateOrConnectWithoutRoleInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemUserCreateOrConnectWithoutRoleInput>;
export const SystemUserCreateOrConnectWithoutRoleInputObjectZodSchema = makeSchema();
