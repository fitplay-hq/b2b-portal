import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemPermissionResourceActionCompoundUniqueInputObjectSchema as SystemPermissionResourceActionCompoundUniqueInputObjectSchema } from './SystemPermissionResourceActionCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  resource_action: z.lazy(() => SystemPermissionResourceActionCompoundUniqueInputObjectSchema).optional()
}).strict();
export const SystemPermissionWhereUniqueInputObjectSchema: z.ZodType<Prisma.SystemPermissionWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionWhereUniqueInput>;
export const SystemPermissionWhereUniqueInputObjectZodSchema = makeSchema();
