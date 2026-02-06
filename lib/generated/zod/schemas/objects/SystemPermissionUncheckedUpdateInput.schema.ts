import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { SystemRoleUncheckedUpdateManyWithoutPermissionsNestedInputObjectSchema as SystemRoleUncheckedUpdateManyWithoutPermissionsNestedInputObjectSchema } from './SystemRoleUncheckedUpdateManyWithoutPermissionsNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  resource: z.union([z.string().max(50), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  action: z.union([z.string().max(20), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  description: z.union([z.string().max(255), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  roles: z.lazy(() => SystemRoleUncheckedUpdateManyWithoutPermissionsNestedInputObjectSchema).optional()
}).strict();
export const SystemPermissionUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.SystemPermissionUncheckedUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionUncheckedUpdateInput>;
export const SystemPermissionUncheckedUpdateInputObjectZodSchema = makeSchema();
