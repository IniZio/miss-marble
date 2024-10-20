import cron from "node-cron";
import { getSupabase } from "./integrations/supabase";

import {
  addMonths,
  isBefore,
} from "date-fns";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(customParseFormat);
dayjs.extend(timezone);

let isProcessing = false;

export const expireOrderAssets = async () => {
  if (isProcessing) {
    return;
  }
  isProcessing = true;
  console.log("[Expire Order Assets] Start");

  try {
    const supabase = getSupabase();
    const assetsResult = await supabase.storage.from("order-assets").list("", { limit: 100, sortBy: { column: "created_at", order: "asc" } });
    const assets = assetsResult.data || [];

    // Expire assets that are older than 3 months
    const expiredAssets = assets
      .filter((asset) => asset.created_at && isBefore(new Date(asset.created_at), addMonths(new Date(), -3)));
    if (expiredAssets.length === 0) {
      console.log("[Expire Order Assets] No assets to expire");
      return;
    }

    // Log earlies to latest asset creation date
    const earliestDate = expiredAssets[0].created_at
    const latestDate = expiredAssets[expiredAssets.length - 1].created_at;
    console.log(`[Expire Order Assets] Removing assets created between ${earliestDate} and ${latestDate}`);

    await supabase.storage.from("order-assets").remove(expiredAssets.map((asset) => asset.name));
    console.log(`[Expire Order Assets] Expired ${expiredAssets.length} assets`);
  } catch (error) {
    console.error("[Expire Order Assets] Error", error);
  } finally {
    isProcessing = false;
  }
};
