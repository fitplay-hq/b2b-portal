import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  resource: z.string(),
  action: z.string()
}).strict();
export const SystemPermissionResourceActionCompoundUniqueInputObjectSchema: z.ZodType<Prisma.SystemPermissionResourceActionCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionResourceActionCompoundUniqueInput>;
export const SystemPermissionResourceActionCompoundUniqueInputObjectZodSchema = makeSchema();
