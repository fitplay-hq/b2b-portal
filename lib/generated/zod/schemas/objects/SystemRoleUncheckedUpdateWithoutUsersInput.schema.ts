import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { SystemPermissionUncheckedUpdateManyWithoutRolesNestedInputObjectSchema as SystemPermissionUncheckedUpdateManyWithoutRolesNestedInputObjectSchema } from './SystemPermissionUncheckedUpdateManyWithoutRolesNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  isActive: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  permissions: z.lazy(() => SystemPermissionUncheckedUpdateManyWithoutRolesNestedInputObjectSchema).optional()
}).strict();
export const SystemRoleUncheckedUpdateWithoutUsersInputObjectSchema: z.ZodType<Prisma.SystemRoleUncheckedUpdateWithoutUsersInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleUncheckedUpdateWithoutUsersInput>;
export const SystemRoleUncheckedUpdateWithoutUsersInputObjectZodSchema = makeSchema();
