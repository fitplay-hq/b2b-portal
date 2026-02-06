import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  resource: z.string(),
  action: z.string(),
  description: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const SystemPermissionUncheckedCreateWithoutRolesInputObjectSchema: z.ZodType<Prisma.SystemPermissionUncheckedCreateWithoutRolesInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionUncheckedCreateWithoutRolesInput>;
export const SystemPermissionUncheckedCreateWithoutRolesInputObjectZodSchema = makeSchema();
