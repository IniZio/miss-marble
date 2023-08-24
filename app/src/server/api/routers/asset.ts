import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { supabase } from '@/server/clients/supabase';
import { randomUUID } from 'crypto';
import mime from 'mime-types';
import { PUBLIC_STORAGE_BUCKET_NAME } from '@/constants';
import { prisma } from '@/server/db';

export const assetRouter = createTRPCRouter({
  presignUpload: publicProcedure
    .input(z.object({ mimeType: z.string() }))
    .mutation(async ({ input }) => {
      const filename = `${randomUUID()}.${mime.extension(input.mimeType)}`;
      const { data: presignedUpload } = await supabase.storage.from(PUBLIC_STORAGE_BUCKET_NAME).createSignedUploadUrl(filename);
      const { data: { publicUrl } } = supabase.storage.from(PUBLIC_STORAGE_BUCKET_NAME).getPublicUrl(filename);

      const asset = await prisma.asset.create({
        data: {
          provider: 'supabase',
          bucket: PUBLIC_STORAGE_BUCKET_NAME,
          objectKey: filename,
          mimeType: input.mimeType,
          url: publicUrl,
        }
      });

      return {
        presignedUpload: presignedUpload!,
        asset,
      }
    }),
});
