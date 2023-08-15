import { type AppType } from "next/app";
import { Inter, PT_Sans, Roboto } from 'next/font/google';
import { api } from "@/lib/utils/api";
import "@/styles/globals.css";
import I18nProvider from '@/providers/I18nProvider';

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
const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
  weight: ["400", "500", "700"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <I18nProvider>
      <style jsx global>{`
        html {
          font-family: ${roboto.style.fontFamily};
        }
      `}
      </style>
      <Component {...pageProps} />
    </I18nProvider>
  );
};

export default api.withTRPC(MyApp);
