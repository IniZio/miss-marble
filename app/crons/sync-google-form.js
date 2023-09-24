const cron = require('node-cron');

const enqueueSyncGoogleForm = () => fetch(process.env.API_URL + '/api/jobs/sync-google-form')

enqueueSyncGoogleForm();
cron.schedule('*/10 * * * *', enqueueSyncGoogleForm);