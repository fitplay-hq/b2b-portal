import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ModesSchema } from '../enums/Modes.schema'

const makeSchema = () => z.object({
  set: ModesSchema.optional()
}).strict();
export const EnumModesFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.EnumModesFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.EnumModesFieldUpdateOperationsInput>;
export const EnumModesFieldUpdateOperationsInputObjectZodSchema = makeSchema();
