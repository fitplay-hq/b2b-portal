import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ModesSchema } from '../enums/Modes.schema';
import { StatusSchema } from '../enums/Status.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  totalAmount: z.number(),
  consigneeName: z.string().optional(),
  consigneePhone: z.string().optional(),
  consigneeEmail: z.string().optional(),
  consignmentNumber: z.string().optional().nullable(),
  deliveryService: z.string().optional().nullable(),
  deliveryAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  modeOfDelivery: ModesSchema.optional(),
  requiredByDate: z.coerce.date(),
  deliveryReference: z.string().optional().nullable(),
  packagingInstructions: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  shippingLabelUrl: z.string().optional().nullable(),
  isMailSent: z.boolean().optional(),
  status: StatusSchema.optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  numberOfBundles: z.number().int().optional().nullable()
}).strict();
export const OrderCreateManyClientInputObjectSchema: z.ZodType<Prisma.OrderCreateManyClientInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateManyClientInput>;
export const OrderCreateManyClientInputObjectZodSchema = makeSchema();
