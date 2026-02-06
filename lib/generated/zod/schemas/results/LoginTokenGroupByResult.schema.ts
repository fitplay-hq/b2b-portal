import * as z from 'zod';
export const LoginTokenGroupByResultSchema = z.array(z.object({
  id: z.string(),
  token: z.string(),
  identifier: z.string(),
  password: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  expires: z.date(),
  _count: z.object({
    id: z.number(),
    token: z.number(),
    identifier: z.number(),
    password: z.number(),
    userId: z.number(),
    userType: z.number(),
    createdAt: z.number(),
    expires: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    token: z.string().nullable(),
    identifier: z.string().nullable(),
    password: z.string().nullable(),
    userId: z.string().nullable(),
    createdAt: z.date().nullable(),
    expires: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    token: z.string().nullable(),
    identifier: z.string().nullable(),
    password: z.string().nullable(),
    userId: z.string().nullable(),
    createdAt: z.date().nullable(),
    expires: z.date().nullable()
  }).nullable().optional()
}));