import { z } from "zod";

export const suburbSchema = z.object({
  id: z.number(),
  category: z.string().nullable(),
  location: z.string(),
  postcode: z.number(),
  state: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export const suburbListSchema = z.array(suburbSchema);

export type SuburbList = typeof suburbListSchema;