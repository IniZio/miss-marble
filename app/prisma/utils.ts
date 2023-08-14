import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { supabase } from '@/server/clients/supabase';

export const readAsset = (filename: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, `./assets/${filename}`), (err, data) => {
      if (err) reject(err);
      resolve(data);
    }
  )});
}

export const uploadPublicAsset = async (filename: string): Promise<{
  provider: string,
  mimeType: string,
  bucket: string,
  objectKey: string,
  url: string,
}> => {
  const bucketName = 'missmarble'
  await supabase.storage.createBucket(bucketName, { public: true });
  await supabase.storage
    .from(bucketName)
    .upload(
      filename,
      await readAsset(filename),
      { upsert: true, contentType: mime.contentType(filename) as string }
    );
  const assetUrl = supabase.storage.from('missmarble').getPublicUrl(filename);
  return {
    provider: 'supabase',
    mimeType: 'image/jpeg',
    bucket: 'missmarble',
    objectKey: filename,
    url: assetUrl.data.publicUrl,
  }
}