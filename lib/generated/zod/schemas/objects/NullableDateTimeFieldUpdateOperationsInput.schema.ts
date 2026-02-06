import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  set: z.coerce.date().optional()
}).strict();
export const NullableDateTimeFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput>;
export const NullableDateTimeFieldUpdateOperationsInputObjectZodSchema = makeSchema();
