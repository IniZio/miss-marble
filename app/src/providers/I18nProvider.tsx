import { type PropsWithChildren } from 'react';
import { IntlProvider } from 'react-intl';
import zhHantHKMessages from '../i18n/zh_Hant_HK.json';
import { Locale } from '@/i18n/types';

const localeMessages = {
  'zh-Hant-HK': zhHantHKMessages,
};

const I18nProvider: React.FC<PropsWithChildren> = (props) => {
  const messages = localeMessages['zh-Hant-HK'];

  return (
    <IntlProvider defaultLocale={Locale.zhHantHK} locale={Locale.zhHantHK} messages={messages}>
      {props.children}
    </IntlProvider>
  );
};

export default I18nProvider;