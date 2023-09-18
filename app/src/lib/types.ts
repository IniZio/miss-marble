import { type NextPage } from 'next';
import type React from 'react';
import { type PropsWithChildren, type ReactNode } from 'react';

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  Layout: React.FC<PropsWithChildren>
}