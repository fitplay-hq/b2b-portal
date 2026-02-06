import * as z from 'zod';

export const ModesSchema = z.enum(['AIR', 'SURFACE', 'HAND_DELIVERY'])

export type Modes = z.infer<typeof ModesSchema>;