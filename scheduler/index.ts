import * as cron from 'node-cron';

import { syncGoogleOrder } from './sync-google-order';
import { syncGoogleInventory } from './sync-google-inventory'

let isSyncing = false;
const syncGoogle = async () => {
  if (isSyncing) {
    return;
  }

  isSyncing = true;
  await syncGoogleOrder();
  await syncGoogleInventory();
  isSyncing = false;
}

cron.schedule('*/10 * * * *',syncGoogle );
syncGoogle();