// import { z } from "zod";
// import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
// import { supabase } from '@/server/clients/supbase';
// import { randomUUID } from 'crypto';
// import mime from 'mime-types';

// export const assetRouter = createTRPCRouter({
//   presignUpload: publicProcedure
//     .input(z.object({ bucket: z.string(), mimeType: z.string() }))
//     .mutation(({ input }) => {
//       const filename = `${randomUUID()}.${mime.extension(input.mimeType)}`;

//       return supabase.storage.from(input.bucket).createSignedUrl(filename, 60 * 60 * 24 * 7);
//     }),
// });
