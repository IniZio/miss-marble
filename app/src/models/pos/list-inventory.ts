import { z } from 'zod'
import { assetSchema } from '../asset'

export const inventoryCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const inventoryLevelSchema = z.object({
  stockLocation: z.object({
    id: z.string(),
    name: z.string(),
  }),
  name: z.string(),
  quantity: z.number(),
  safeQuantity: z.number(),
  unit: z.string().nullable(),
})

export const listInventorySchema = z.object({
  sku: z.string(),
  name: z.string(),
  thumbnail: assetSchema.nullish(),
  category: inventoryCategorySchema.nullish(),
  inventoryLevels: z.array(inventoryLevelSchema),
})

export type ListInventory = z.infer<typeof listInventorySchema>