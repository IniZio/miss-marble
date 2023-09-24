const cron = require('node-cron');

const enqueueSyncGoogleForm = () => fetch(process.env.API_URL + '/jobs/sync-google-form')
  .then(console.log(`Synced successfully! ${new Date().toISOString()}`))
  .catch(console.error);

enqueueSyncGoogleForm();
cron.schedule('*/10 * * * *', enqueueSyncGoogleForm);

console.log(`Registered cronjob sync-google-form ${new Date().toISOString()}`);