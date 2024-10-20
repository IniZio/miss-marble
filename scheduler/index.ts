import * as cron from 'node-cron';

import { syncGoogleOrder } from './sync-google-order';
import { expireOrderAssets } from './expire-order-assets';


cron.schedule('*/15 * * * *', () => syncGoogleOrder());
cron.schedule('0 0 * * *', () => expireOrderAssets());

syncGoogleOrder();
expireOrderAssets();
