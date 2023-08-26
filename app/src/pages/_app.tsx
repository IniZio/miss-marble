import { type AppType } from "next/app";
import { Inter, PT_Sans, Roboto, Noto_Sans } from 'next/font/google';
import { api } from "@/lib/utils/api";
import "@/styles/globals.css";
import I18nProvider from '@/providers/I18nProvider';
import { CartContext, CartProvider } from '@/modules/cart/provider';

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

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <I18nProvider>
      <CartProvider>
        <style jsx global>{`
          html {
            font-family: ${notosans.style.fontFamily};
          }
        `}
        </style>
        <Component {...pageProps} />
      </CartProvider>
    </I18nProvider>
  );
};

export default api.withTRPC(MyApp);
