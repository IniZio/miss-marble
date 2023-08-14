import { type AppType } from "next/app";
import { Inter } from 'next/font/google';
import { api } from "@/lib/utils/api";
import "@/styles/globals.css";
import I18nProvider from '@/providers/I18nProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
// const notosans = Noto_Sans_HK({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-notosans',
//   weight: ["400"],
// });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <I18nProvider>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}
      </style>
      <Component {...pageProps} />
    </I18nProvider>
  );
};

export default api.withTRPC(MyApp);
