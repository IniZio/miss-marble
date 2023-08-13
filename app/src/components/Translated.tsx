import { type Translation } from '@/models/translation';
import React from 'react';

// FIXME: Assume only zh_Hant_HK for now
const Translated: React.FC<{ t: Translation }> = ({ t }) => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    <>{t.text.zh_Hant_HK}</>
  );
}

export default Translated