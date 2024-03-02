import * as cron from 'node-cron';

import { syncGoogleOrder } from './sync-google-order';
import { syncGoogleInventory } from './sync-google-inventory'
import { refreshAppCache } from './refresh-app-cache';

let isSyncing = false;
const syncGoogle = async (jobtype: 'order' | 'inventory') => {
  if (isSyncing) {
    return;
  }

  isSyncing = true;
  try {
    switch (jobtype) {
      case 'order':
        await syncGoogleOrder();
        break;
      case 'inventory':
        await syncGoogleInventory();
        break;
    }
  } finally {
    isSyncing = false;
  }
}

cron.schedule('* * * * *', () => refreshAppCache());
cron.schedule('0,10,20,30,40,50 * * * *', () => syncGoogle('order'));
// cron.schedule('5,15,25,35,45,55 * * * *', () => syncGoogle('inventory'));

syncGoogle('order');