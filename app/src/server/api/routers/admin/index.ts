import { z } from "zod";
import day from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { prisma } from '@/server/db';
import { type Prisma } from '@prisma/client';
import { type JsonObject } from '@prisma/client/runtime/library';
import googlesheet from '../../integrations/google-sheet';
import { productRouter } from './product';

day.extend(utc);
day.extend(timezone);

export const adminRouter = createTRPCRouter({
  product: productRouter,
});
