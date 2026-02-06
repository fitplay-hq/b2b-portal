import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  email: z.literal(true).optional(),
  password: z.literal(true).optional(),
  phone: z.literal(true).optional(),
  companyID: z.literal(true).optional(),
  companyName: z.literal(true).optional(),
  isShowPrice: z.literal(true).optional(),
  address: z.literal(true).optional(),
  role: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const ClientMaxAggregateInputObjectSchema: z.ZodType<Prisma.ClientMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ClientMaxAggregateInputType>;
export const ClientMaxAggregateInputObjectZodSchema = makeSchema();
