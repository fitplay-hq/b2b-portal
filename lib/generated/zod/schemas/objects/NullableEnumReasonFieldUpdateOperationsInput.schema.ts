import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ReasonSchema } from '../enums/Reason.schema'

const makeSchema = () => z.object({
  set: ReasonSchema.optional()
}).strict();
export const NullableEnumReasonFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumReasonFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumReasonFieldUpdateOperationsInput>;
export const NullableEnumReasonFieldUpdateOperationsInputObjectZodSchema = makeSchema();
