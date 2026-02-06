import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { SystemPermissionUncheckedUpdateManyWithoutRolesNestedInputObjectSchema as SystemPermissionUncheckedUpdateManyWithoutRolesNestedInputObjectSchema } from './SystemPermissionUncheckedUpdateManyWithoutRolesNestedInput.schema';
import { SystemUserUncheckedUpdateManyWithoutRoleNestedInputObjectSchema as SystemUserUncheckedUpdateManyWithoutRoleNestedInputObjectSchema } from './SystemUserUncheckedUpdateManyWithoutRoleNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string().max(50), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string().max(255), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  isActive: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  permissions: z.lazy(() => SystemPermissionUncheckedUpdateManyWithoutRolesNestedInputObjectSchema).optional(),
  users: z.lazy(() => SystemUserUncheckedUpdateManyWithoutRoleNestedInputObjectSchema).optional()
}).strict();
export const SystemRoleUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.SystemRoleUncheckedUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleUncheckedUpdateInput>;
export const SystemRoleUncheckedUpdateInputObjectZodSchema = makeSchema();
