export const refreshAppCache = async () => {
  try {
    console.log('[Refresh App Cache]: Starting to trigger...')
    await fetch(`${process.env.APP_URL}/pos`);
    console.log('[Refresh App Cache]: Finished!')
  } catch(e) {
    console.error('[Refresh App Cache]: Failed to trigger {}', e);
  }
}