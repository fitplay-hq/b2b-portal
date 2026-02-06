import * as z from 'zod';

export const CategorySchema = z.enum(['stationery', 'accessories', 'funAndStickers', 'drinkware', 'apparel', 'travelAndTech', 'books', 'welcomeKit', 'newcategory', 'consumables'])

export type Category = z.infer<typeof CategorySchema>;