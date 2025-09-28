import { z } from "zod";

export const suburbSchema = z.object({
  id: z.string(),
  category: z.string().nullable(),
  location: z.string().nullable(),
  postcode: z.string().nullable(),
  state: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
});

export const suburbListSchema = z.array(suburbSchema);

export type SuburbList = typeof suburbListSchema;