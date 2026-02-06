import * as z from 'zod';
export const SystemPermissionGroupByResultSchema = z.array(z.object({
  id: z.string(),
  resource: z.string(),
  action: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    resource: z.number(),
    action: z.number(),
    description: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    roles: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    resource: z.string().nullable(),
    action: z.string().nullable(),
    description: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    resource: z.string().nullable(),
    action: z.string().nullable(),
    description: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));