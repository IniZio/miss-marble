import * as cron from 'node-cron';

import { syncGoogleOrder } from './sync-google-order';
import { syncGoogleInventory } from './sync-google-inventory'

cron.schedule('*/10 * * * *', async () => {
  await syncGoogleOrder();
  await syncGoogleInventory();
});