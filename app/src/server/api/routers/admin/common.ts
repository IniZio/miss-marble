import { z } from "zod";

export const translationInputSchema = z.object({
  id: z.string().optional(),
  text: z.record(z.string()),
});

export const assetInputSchema = z.object({
  id: z.string(),
});

