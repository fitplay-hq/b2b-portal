import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemUserScalarWhereInputObjectSchema as SystemUserScalarWhereInputObjectSchema } from './SystemUserScalarWhereInput.schema';
import { SystemUserUpdateManyMutationInputObjectSchema as SystemUserUpdateManyMutationInputObjectSchema } from './SystemUserUpdateManyMutationInput.schema';
import { SystemUserUncheckedUpdateManyWithoutRoleInputObjectSchema as SystemUserUncheckedUpdateManyWithoutRoleInputObjectSchema } from './SystemUserUncheckedUpdateManyWithoutRoleInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SystemUserScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => SystemUserUpdateManyMutationInputObjectSchema), z.lazy(() => SystemUserUncheckedUpdateManyWithoutRoleInputObjectSchema)])
}).strict();
export const SystemUserUpdateManyWithWhereWithoutRoleInputObjectSchema: z.ZodType<Prisma.SystemUserUpdateManyWithWhereWithoutRoleInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemUserUpdateManyWithWhereWithoutRoleInput>;
export const SystemUserUpdateManyWithWhereWithoutRoleInputObjectZodSchema = makeSchema();
