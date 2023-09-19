import { AppProps, type AppType } from "next/app";
import { Inter, PT_Sans, Roboto, Noto_Sans } from 'next/font/google';
import { api } from "@/lib/api";
import "@/styles/globals.css";
import I18nProvider from '@/providers/I18nProvider';
import { CartContext, CartProvider } from '@/modules/cart/provider';
import { NextPageWithLayout } from '@/lib/types';
import { NextPage } from 'next';
import { PropsWithChildren } from 'react';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
const ptsans = PT_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ptsans',
  weight: ["400", "700"],
});
// const roboto = Roboto({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-roboto',
//   weight: ["400", "500", "700"],
// });
const notosans = Noto_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-notosans',
  weight: ["400", "500", "700"],
});

type AppPropsWithLayout = AppProps & {
  Component: NextPage | NextPageWithLayout
}

function hasLayout (Component: unknown): Component is NextPageWithLayout {
  return typeof Component === 'function' && 'Layout' in Component
}

const MyApp: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  const Layout = hasLayout(Component) ? Component.Layout : ((props: PropsWithChildren) => <>{props.children}</>)
  console.log('Layout', Layout)

  return (
    <I18nProvider>
      <CartProvider>
        <style jsx global>{`
          html {
            font-family: ${notosans.style.fontFamily};
          }
        `}
        </style>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CartProvider>
    </I18nProvider>
  );
};

export default api.withTRPC(MyApp);
