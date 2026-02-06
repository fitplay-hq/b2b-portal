import * as z from 'zod';
export const ResetTokenGroupByResultSchema = z.array(z.object({
  id: z.string(),
  identifier: z.string(),
  password: z.string(),
  token: z.string(),
  userId: z.string(),
  expires: z.date(),
  createdAt: z.date(),
  _count: z.object({
    id: z.number(),
    identifier: z.number(),
    password: z.number(),
    token: z.number(),
    userId: z.number(),
    userType: z.number(),
    expires: z.number(),
    createdAt: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    identifier: z.string().nullable(),
    password: z.string().nullable(),
    token: z.string().nullable(),
    userId: z.string().nullable(),
    expires: z.date().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    identifier: z.string().nullable(),
    password: z.string().nullable(),
    token: z.string().nullable(),
    userId: z.string().nullable(),
    expires: z.date().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional()
}));