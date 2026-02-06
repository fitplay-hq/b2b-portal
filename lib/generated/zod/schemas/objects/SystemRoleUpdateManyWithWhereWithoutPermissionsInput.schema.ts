import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleScalarWhereInputObjectSchema as SystemRoleScalarWhereInputObjectSchema } from './SystemRoleScalarWhereInput.schema';
import { SystemRoleUpdateManyMutationInputObjectSchema as SystemRoleUpdateManyMutationInputObjectSchema } from './SystemRoleUpdateManyMutationInput.schema';
import { SystemRoleUncheckedUpdateManyWithoutPermissionsInputObjectSchema as SystemRoleUncheckedUpdateManyWithoutPermissionsInputObjectSchema } from './SystemRoleUncheckedUpdateManyWithoutPermissionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SystemRoleScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => SystemRoleUpdateManyMutationInputObjectSchema), z.lazy(() => SystemRoleUncheckedUpdateManyWithoutPermissionsInputObjectSchema)])
}).strict();
export const SystemRoleUpdateManyWithWhereWithoutPermissionsInputObjectSchema: z.ZodType<Prisma.SystemRoleUpdateManyWithWhereWithoutPermissionsInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleUpdateManyWithWhereWithoutPermissionsInput>;
export const SystemRoleUpdateManyWithWhereWithoutPermissionsInputObjectZodSchema = makeSchema();
